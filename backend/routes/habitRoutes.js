const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
    addHabit,
    getHabits,
    updateHabit,
    deleteHabit,
    markHabitToday
} = require("../controllers/habitController");
router.post("/", authMiddleware, addHabit);
router.get("/", authMiddleware, getHabits);
router.put("/:id", authMiddleware, updateHabit);
router.delete("/:id", authMiddleware, deleteHabit);
router.post("/:id/log", authMiddleware, markHabitToday);
module.exports = router;