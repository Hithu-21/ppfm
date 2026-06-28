const db = require("../config/db");

const addHabit = (req, res) => {
    const { habit_name } = req.body;
    const userId = req.user.id;
    if (!habit_name) {
        return res.status(400).json({
            message: "Habit name is required"
        });
    }
    const query = `
    INSERT INTO habits(user_id, habit_name)
    VALUES (?, ?)
    `;
    db.query(query, [userId, habit_name], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database Error"
            });
        }
        return res.status(201).json({
            message: "Habit Added Successfully"
        });
    });
};

const getHabits = (req, res) => {
    const userId = req.user.id;
    const query = `
    SELECT *
    FROM habits
    WHERE user_id = ?
    ORDER BY created_at DESC
    `;
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database Error"
            });
        }
        return res.status(200).json(result);
    });
};

const updateHabit = (req, res) => {
    const { id } = req.params;
    const { habit_name } = req.body;
    const userId = req.user.id;
    if (!habit_name) {
        return res.status(400).json({
            message: "Habit name is required"
        });
    }
    const query = `
    UPDATE habits
    SET habit_name = ?
    WHERE id = ? AND user_id = ?
    `;
    db.query(query, [habit_name, id, userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database Error"
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Habit not found"
            });
        }
        return res.status(200).json({
            message: "Habit Updated Successfully"
        });
    });
};

const deleteHabit = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const query = `
    DELETE FROM habits
    WHERE id = ? AND user_id = ?
    `;
    db.query(query, [id, userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database Error"
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Habit not found"
            });
        }
        return res.status(200).json({
            message: "Habit Deleted Successfully"
        });
    });
};

const markHabitToday = (req, res) => {
    const { id } = req.params;
    const today = new Date().toISOString().split("T")[0];
    const checkQuery = `
    SELECT *
    FROM habit_logs
    WHERE habit_id = ? AND date = ?
    `;
    db.query(checkQuery, [id, today], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database Error"
            });
        }
        if (result.length > 0) {
            const updateQuery = `
            UPDATE habit_logs
            SET completed = 1
            WHERE habit_id = ? AND date = ?
            `;
            db.query(updateQuery, [id, today], (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database Error"
                    });
                }
                return res.status(200).json({
                    message: "Habit marked completed for today"
                });
            });
        } else {
            const insertQuery = `
            INSERT INTO habit_logs(habit_id, date, completed)
            VALUES (?, ?, 1)
            `;
            db.query(insertQuery, [id, today], (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database Error"
                    });
                }
                return res.status(201).json({
                    message: "Habit marked completed for today"
                });
            });
        }
    });
};

module.exports = {
    addHabit,
    getHabits,
    updateHabit,
    deleteHabit,
    markHabitToday
};