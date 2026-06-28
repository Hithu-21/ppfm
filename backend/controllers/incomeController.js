const db = require("../config/db");

const addIncome = (req, res) => {
    const { amount, source, date } = req.body;
    const userId = req.user.id;
    const finalDate = date || new Date().toISOString().split("T")[0];
    if (!amount) {
        return res.status(400).json({
            message: "Amount is required"
        });
    }
    const query = `
    INSERT INTO incomes(
        user_id,
        amount,
        source,
        date
    )
    VALUES (?, ?, ?, ?)
    `;
    db.query(
        query,
        [userId, amount, source, finalDate],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            return res.status(201).json({
                message: "Income Added Successfully"
            });
        }
    );
};

const getIncome = (req, res) => {
    const userId = req.user.id;
    const query = `
    SELECT *
    FROM incomes
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

const updateIncome = (req, res) => {
    const { id } = req.params;
    const { amount, source, date } = req.body;
    const userId = req.user.id;
    if (!amount) {
        return res.status(400).json({
            message: "Amount is required"
        });
    }
    const query = `
    UPDATE incomes
    SET amount = ?, source = ?, date = ?
    WHERE id = ? AND user_id = ?
    `;
    db.query(
        query,
        [amount, source, date, id, userId],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Income not found"
                });
            }
            return res.status(200).json({
                message: "Income Updated Successfully"
            });
        }
    );
};

const deleteIncome = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const query = `
    DELETE FROM incomes
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
                    message: "Income not found"
                });
            }
            return res.status(200).json({
                message: "Income Deleted Successfully"
            });
        }
    );
};

module.exports = {
    addIncome,
    getIncome,
    updateIncome,
    deleteIncome
};