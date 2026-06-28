const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
    addBudget,
    getBudget,
    updateBudget,
    deleteBudget
} = require("../controllers/budgetController");
router.post("/", authMiddleware, addBudget);
router.get("/", authMiddleware, getBudget);
router.put("/:id", authMiddleware, updateBudget);
router.delete("/:id", authMiddleware, deleteBudget);
module.exports = router;