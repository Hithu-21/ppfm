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
    const habitQuery = `
    SELECT *
    FROM habits
    WHERE user_id = ?
    ORDER BY created_at DESC
    `;
    db.query(habitQuery, [userId], (err, habits) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database Error"
            });
        }
        if (habits.length === 0) {
            return res.status(200).json([]);
        }
        const habitIds = habits.map((habit) => habit.id);
        const logQuery = `
        SELECT habit_id, DATE_FORMAT(date, '%Y-%m-%d') AS logDate, completed
        FROM habit_logs
        WHERE habit_id IN (?)
        AND completed = 1
        ORDER BY habit_id, date
        `;
        db.query(logQuery, [habitIds], (err, logs) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }
            const today = new Date().toLocaleDateString("en-CA");
            const logsByHabit = {};
            for (const log of logs) {
                if (!logsByHabit[log.habit_id]) {
                    logsByHabit[log.habit_id] = [];
                }
                logsByHabit[log.habit_id].push(log.logDate);
            }
            const calculateStats = (dates) => {
                if (!dates || dates.length === 0) {
                    return {
                        currentStreak: 0,
                        maxStreak: 0,
                        totalCheckins: 0,
                        checkedToday: false
                    };
                }
                const uniqueDates = [...new Set(dates)].sort();
                const totalCheckins = uniqueDates.length;
                const checkedToday = uniqueDates.includes(today);
                let maxStreak = 1;
                let tempStreak = 1;
                for (let i = 1; i < uniqueDates.length; i++) {
                    const prevDate = new Date(uniqueDates[i - 1]);
                    const currDate = new Date(uniqueDates[i]);
                    const diffDays =
                        (currDate - prevDate) / (1000 * 60 * 60 * 24);
                    if (diffDays === 1) {
                        tempStreak++;
                    } else {
                        tempStreak = 1;
                    }
                    maxStreak = Math.max(maxStreak, tempStreak);
                }
                let currentStreak = 0;
                let currentDate = new Date(today);
                while (true) {
                    const year = currentDate.getFullYear();
                    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
                    const day = String(currentDate.getDate()).padStart(2, "0");
                    const dateString = `${year}-${month}-${day}`;
                    if (uniqueDates.includes(dateString)) {
                        currentStreak++;
                        currentDate.setDate(currentDate.getDate() - 1);
                    } else {
                        break;
                    }
                }
                return {
                    currentStreak,
                    maxStreak,
                    totalCheckins,
                    checkedToday
                };
            };
            const habitsWithStats = habits.map((habit) => {
                const stats = calculateStats(logsByHabit[habit.id]);
                return {
                    ...habit,
                    ...stats
                };
            });
            return res.status(200).json(habitsWithStats);
        });
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
    const deleteLogsQuery = `
    DELETE FROM habit_logs
    WHERE habit_id = ?
    `;
    db.query(deleteLogsQuery, [id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database Error"
            });
        }
        const deleteHabitQuery = `
        DELETE FROM habits
        WHERE id = ? AND user_id = ?
        `;
        db.query(deleteHabitQuery, [id, userId], (err, result) => {
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