const db = require("../config/db");

const addTask = (req, res) => {
    const { title, description, deadline, priority, status } = req.body;
    const userId = req.user.id;
    const finalPriority = priority || "MEDIUM";
    const finalStatus = status || "PENDING";
    if (!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }
    const validPriorities = ["LOW", "MEDIUM", "HIGH"];
    if (!validPriorities.includes(finalPriority)) {
        return res.status(400).json({
            message: "Invalid Priority"
        });
    }
    const validStatuses = ["PENDING", "COMPLETED"];
    if (!validStatuses.includes(finalStatus)) {
        return res.status(400).json({
            message: "Invalid Status"
        });
    }
    const query = `
    INSERT INTO tasks(
        user_id,
        title,
        description,
        deadline,
        priority,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
        query,
        [userId, title, description, deadline, finalPriority, finalStatus],
        (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }
            return res.status(201).json({
                message: "Task Added Successfully"
            });
        }
    );
};

const getTasks = (req, res) => {
    const userId = req.user.id;
    const { status, priority } = req.query;
    let query = `
    SELECT *
    FROM tasks
    WHERE user_id = ?
    `;
    let values = [userId];
    if (status) {
        query += " AND status = ?";
        values.push(status);
    }
    if (priority) {
        query += " AND priority = ?";
        values.push(priority);
    }
    query += " ORDER BY deadline ASC";
    db.query(
        query,
        values,
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }
            return res.status(200).json(result);
        }
    );
};

const updateTask = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const fetchQuery = `
    SELECT *
    FROM tasks
    WHERE id = ? AND user_id = ?
    `;
    db.query(
        fetchQuery,
        [id, userId],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }
            if (result.length === 0) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }
            const oldTask = result[0];
            const title = req.body.title || oldTask.title;
            const description = req.body.description || oldTask.description;
            const deadline = req.body.deadline || oldTask.deadline;
            const priority = req.body.priority || oldTask.priority;
            const status = req.body.status || oldTask.status;
            const validPriorities = ["LOW", "MEDIUM", "HIGH"];
            if (!validPriorities.includes(priority)) {
                return res.status(400).json({
                    message: "Invalid Priority"
                });
            }
            const validStatuses = ["PENDING", "COMPLETED"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    message: "Invalid Status"
                });
            }
            const updateQuery = `
            UPDATE tasks
            SET title = ?, description = ?, deadline = ?, priority = ?, status = ?
            WHERE id = ? AND user_id = ?
            `;
            db.query(
                updateQuery,
                [title, description, deadline, priority, status, id, userId],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            message: "Database Error"
                        });
                    }
                    return res.status(200).json({
                        message: "Task Updated Successfully"
                    });
                }
            );
        }
    );
};

const deleteTask = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const query = `
    DELETE FROM tasks
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
                    message: "Task not found"
                });
            }
            return res.status(200).json({
                message: "Task Deleted Successfully"
            });
        }
    );
};

module.exports = {
    addTask,
    getTasks,
    updateTask,
    deleteTask
};