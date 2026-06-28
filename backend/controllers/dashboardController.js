const db = require("../config/db");

const getDashboard = (req, res) => {
    const userId = req.user.id;
    const incomeQuery = `
    SELECT COALESCE(SUM(amount), 0) AS totalIncome
    FROM incomes
    WHERE user_id = ?
    `;
    db.query(incomeQuery, [userId], (err, incomeResult) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Error" });
        }
        const totalIncome = Number(incomeResult[0].totalIncome);
        const expenseQuery = `
        SELECT COALESCE(SUM(amount), 0) AS totalExpense
        FROM expenses
        WHERE user_id = ?
        `;
        db.query(expenseQuery, [userId], (err, expenseResult) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Database Error" });
            }
            const totalExpense = Number(expenseResult[0].totalExpense);
            const balance = totalIncome - totalExpense;
            const pendingQuery = `
            SELECT COUNT(*) AS pendingTasks
            FROM tasks
            WHERE user_id = ? AND status = 'PENDING'
            `;
            db.query(pendingQuery, [userId], (err, pendingResult) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Database Error" });
                }
                const pendingTasks = pendingResult[0].pendingTasks;
                const completedQuery = `
                SELECT COUNT(*) AS completedTasks
                FROM tasks
                WHERE user_id = ? AND status = 'COMPLETED'
                `;
                db.query(completedQuery, [userId], (err, completedResult) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Database Error" });
                    }
                    const completedTasks = completedResult[0].completedTasks;
                    const totalHabitsQuery = `
                    SELECT COUNT(*) AS totalHabits
                    FROM habits
                    WHERE user_id = ?
                    `;
                    db.query(totalHabitsQuery, [userId], (err, habitResult) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ message: "Database Error" });
                        }
                        const totalHabits = habitResult[0].totalHabits;
                        const todayCompletedQuery = `
                        SELECT COUNT(*) AS completedHabitsToday
                        FROM habit_logs hl
                        JOIN habits h ON hl.habit_id = h.id
                        WHERE h.user_id = ?
                        AND hl.date = CURDATE()
                        AND hl.completed = 1
                        `;
                        db.query(todayCompletedQuery, [userId], (err, todayHabitResult) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).json({ message: "Database Error" });
                            }
                            const completedHabitsToday = todayHabitResult[0].completedHabitsToday;
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
                                if (err) {
                                    console.log(err);
                                    return res.status(500).json({ message: "Database Error" });
                                }
                                const totalBudget = Number(budgetResult[0].totalBudget);
                                const totalBudgetExpense = Number(budgetResult[0].totalBudgetExpense);
                                const budgetUsed =
                                    totalBudget === 0
                                        ? 0
                                        : Number(((totalBudgetExpense / totalBudget) * 100).toFixed(2));
                                return res.status(200).json({
                                    totalIncome,
                                    totalExpense,
                                    balance,
                                    pendingTasks,
                                    completedTasks,
                                    totalHabits,
                                    completedHabitsToday,
                                    budgetUsed
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