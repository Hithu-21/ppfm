const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
    addTask,
    getTasks,
    updateTask,
    deleteTask
} = require("../controllers/taskController");
router.post("/", authMiddleware, addTask);
router.get("/", authMiddleware, getTasks);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
module.exports = router;