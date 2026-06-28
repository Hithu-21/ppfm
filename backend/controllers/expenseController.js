const db = require("../config/db");

const addExpense = (req, res) => {
    const { amount, category, description, date } = req.body;
    const userId = req.user.id;
    const finalDate = date || new Date().toISOString().split("T")[0];
    if (!amount) {
        return res.status(400).json({
            message: "Amount is required"
        });
    }
    const query = `
    INSERT INTO expenses(
        user_id,
        amount,
        category,
        description,
        date
    )
    VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
        query,
        [userId, amount, category, description, finalDate],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            return res.status(201).json({
                message: "Expense Added Successfully"
            });
        }
    );
};

const getExpenses = (req, res) => {
    const userId = req.user.id;
    const query = `
    SELECT *
    FROM expenses
    WHERE user_id = ?
    `;
    db.query(
        query,
        [userId],
        (err, result) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }
            return res.status(200).json(result);
        }
    );
};

const updateExpense = (req, res) => {
    const { id } = req.params;
    const { amount, category, description, date } = req.body;
    const userId = req.user.id;
    if (!amount) {
        return res.status(400).json({
            message: "Amount is required"
        });
    }
    const query = `
    UPDATE expenses
    SET amount = ?, category = ?, description = ?, date = ?
    WHERE id = ? AND user_id = ?
    `;
    db.query(
        query,
        [amount, category, description, date, id, userId],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Expense not found"
                });
            }
            return res.status(200).json({
                message: "Expense Updated Successfully"
            });
        }
    );
};

const deleteExpense = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const query = `
    DELETE FROM expenses
    WHERE id = ? AND user_id = ?
    `;
    db.query(
        query,
        [id, userId],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Expense not found"
                });
            }
            return res.status(200).json({
                message: "Expense Deleted Successfully"
            });
        }
    );
};

module.exports = {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
};