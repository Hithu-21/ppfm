const db = require("../config/db");

const addBudget = (req, res) => {
    const { category, limit_amount } = req.body;
    const userId = req.user.id;
    if (!category) {
        return res.status(400).json({
            message: "Category is required"
        });
    }
    if(!limitAmt) {
        return res.status(400).json({
            message: "Limit Amount is required"
        });
    }
    const query = `
    INSERT INTO budgets(
        user_id,
        category,
        limit_amount
    )
    VALUES (?, ?, ?)
    `;
    db.query(
        query,
        [userId, category, limit_amount],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            return res.status(201).json({
                message: "Budget Added Successfully"
            });
        }
    );
};

const getBudget= (req, res) => {
    const userId = req.user.id;
    const query = `
    SELECT *
    FROM budgets
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

const updateBudget = (req, res) => {
    const { id } = req.params;
    const { category, limit_amount } = req.body;
    const userId = req.user.id;
    if (!category) {
        return res.status(400).json({
            message: "Category is required"
        });
    }
    if(!limitAmt) {
        return res.status(400).json({
            message: "Limit Amount is required"
        });
    }
    const query = `
    UPDATE budgets
    SET category = ?, limit_amount = ?
    WHERE id = ? AND user_id = ?
    `;
    db.query(
        query,
        [category, limit_amount, id, userId],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Budget not found"
                });
            }
            return res.status(200).json({
                message: "Budget Updated Successfully"
            });
        }
    );
};

const deleteBudget = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const query = `
    DELETE FROM budgets
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
                    message: "Budget not found"
                });
            }
            return res.status(200).json({
                message: "Budget Deleted Successfully"
            });
        }
    );
};

module.exports = {
    addBudget,
    getBudget,
    updateBudget,
    deleteBudget
};