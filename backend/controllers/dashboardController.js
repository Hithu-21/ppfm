const db = require("../config/db");

const getDashboard = (req, res) => {
    const userId = req.user.id;

    const incomeQuery = `
    SELECT COALESCE(SUM(amount), 0) AS totalIncome
    FROM incomes
    WHERE user_id = ?
    `;

    db.query(incomeQuery, [userId], (err, incomeResult) => {
        if (err) return res.status(500).json({ message: "Database Error" });

        const totalIncome = Number(incomeResult[0].totalIncome);

        const expenseQuery = `
        SELECT COALESCE(SUM(amount), 0) AS totalExpense
        FROM expenses
        WHERE user_id = ?
        `;

        db.query(expenseQuery, [userId], (err, expenseResult) => {
            if (err) return res.status(500).json({ message: "Database Error" });

            const totalExpense = Number(expenseResult[0].totalExpense);
            const balance = totalIncome - totalExpense;

            const statsQuery = `
            SELECT
                (SELECT COUNT(*) FROM tasks WHERE user_id = ? AND status = 'PENDING') AS pendingTasks,
                (SELECT COUNT(*) FROM tasks WHERE user_id = ? AND status = 'COMPLETED') AS completedTasks,
                (SELECT COUNT(*) FROM habits WHERE user_id = ?) AS totalHabits,
                (
                    SELECT COUNT(*)
                    FROM habit_logs hl
                    JOIN habits h ON hl.habit_id = h.id
                    WHERE h.user_id = ?
                    AND hl.date = CURDATE()
                    AND hl.completed = 1
                ) AS completedHabitsToday
            `;

            db.query(statsQuery, [userId, userId, userId, userId], (err, statsResult) => {
                if (err) return res.status(500).json({ message: "Database Error" });

                const {
                    pendingTasks,
                    completedTasks,
                    totalHabits,
                    completedHabitsToday
                } = statsResult[0];

                const budgetQuery = `
                SELECT 
                    COALESCE(SUM(b.limit_amount), 0) AS totalBudget,
                    COALESCE(SUM(e.amount), 0) AS totalBudgetExpense
                FROM budgets b
                LEFT JOIN expenses e
                    ON b.user_id = e.user_id
                    AND b.category = e.category
                WHERE b.user_id = ?
                `;

                db.query(budgetQuery, [userId], (err, budgetResult) => {
                    if (err) return res.status(500).json({ message: "Database Error" });

                    const totalBudget = Number(budgetResult[0].totalBudget);
                    const totalBudgetExpense = Number(budgetResult[0].totalBudgetExpense);

                    const budgetUsed =
                        totalBudget === 0
                            ? 0
                            : Number(((totalBudgetExpense / totalBudget) * 100).toFixed(2));

                    const recentExpensesQuery = `
                    SELECT id, amount, category, description, date
                    FROM expenses
                    WHERE user_id = ?
                    ORDER BY date DESC, id DESC
                    LIMIT 5
                    `;

                    db.query(recentExpensesQuery, [userId], (err, recentExpenses) => {
                        if (err) return res.status(500).json({ message: "Database Error" });

                        const recentTasksQuery = `
                        SELECT id, title, priority, status, deadline
                        FROM tasks
                        WHERE user_id = ?
                        ORDER BY 
                            CASE WHEN status = 'PENDING' THEN 0 ELSE 1 END,
                            deadline ASC,
                            id DESC
                        LIMIT 5
                        `;

                        db.query(recentTasksQuery, [userId], (err, recentTasks) => {
                            if (err) return res.status(500).json({ message: "Database Error" });

                            const todayHabitsQuery = `
                            SELECT 
                                h.id,
                                h.habit_name,
                                CASE WHEN hl.completed = 1 THEN true ELSE false END AS checkedToday
                            FROM habits h
                            LEFT JOIN habit_logs hl
                                ON h.id = hl.habit_id
                                AND hl.date = CURDATE()
                            WHERE h.user_id = ?
                            ORDER BY checkedToday ASC, h.created_at DESC
                            LIMIT 5
                            `;

                            db.query(todayHabitsQuery, [userId], (err, todayHabits) => {
                                if (err) return res.status(500).json({ message: "Database Error" });

                                const expenseCategoryQuery = `
                                SELECT category, COALESCE(SUM(amount), 0) AS total
                                FROM expenses
                                WHERE user_id = ?
                                GROUP BY category
                                ORDER BY total DESC
                                `;

                                db.query(expenseCategoryQuery, [userId], (err, expenseCategoryData) => {
                                    if (err) return res.status(500).json({ message: "Database Error" });

                                    const monthlyQuery = `
                                    SELECT 
                                        month,
                                        SUM(income) AS income,
                                        SUM(expense) AS expense
                                    FROM (
                                        SELECT 
                                            DATE_FORMAT(date, '%Y-%m') AS month,
                                            SUM(amount) AS income,
                                            0 AS expense
                                        FROM incomes
                                        WHERE user_id = ?
                                        GROUP BY DATE_FORMAT(date, '%Y-%m')

                                        UNION ALL

                                        SELECT 
                                            DATE_FORMAT(date, '%Y-%m') AS month,
                                            0 AS income,
                                            SUM(amount) AS expense
                                        FROM expenses
                                        WHERE user_id = ?
                                        GROUP BY DATE_FORMAT(date, '%Y-%m')
                                    ) AS combined
                                    GROUP BY month
                                    ORDER BY month ASC
                                    `;

                                    db.query(monthlyQuery, [userId, userId], (err, monthlyIncomeExpenseData) => {
                                        if (err) return res.status(500).json({ message: "Database Error" });

                                        const smartInsights = [];

                                        smartInsights.push(
                                            balance < 0
                                                ? `Your expenses exceed your income by ₹${Math.abs(balance)}.`
                                                : `You currently have ₹${balance} remaining after expenses.`
                                        );

                                        if (totalIncome > 0) {
                                            const savingsRate = Number(((balance / totalIncome) * 100).toFixed(2));
                                            smartInsights.push(`Your current savings rate is ${savingsRate}%.`);
                                        }

                                        smartInsights.push(
                                            pendingTasks > 0
                                                ? `You have ${pendingTasks} pending task${pendingTasks > 1 ? "s" : ""}.`
                                                : "Great job! You have no pending tasks."
                                        );

                                        if (totalHabits > 0) {
                                            smartInsights.push(
                                                `You completed ${completedHabitsToday}/${totalHabits} habits today.`
                                            );
                                        }

                                        return res.status(200).json({
                                            totalIncome,
                                            totalExpense,
                                            balance,
                                            pendingTasks,
                                            completedTasks,
                                            totalHabits,
                                            completedHabitsToday,
                                            budgetUsed,
                                            recentExpenses,
                                            recentTasks,
                                            todayHabits,
                                            smartInsights,
                                            expenseCategoryData,
                                            monthlyIncomeExpenseData
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

module.exports = {
    getDashboard
};