const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
    addIncome,
    getIncome,
    updateIncome,
    deleteIncome
} = require("../controllers/incomeController");
router.post("/", authMiddleware, addIncome);
router.get("/", authMiddleware, getIncome);
router.put("/:id", authMiddleware, updateIncome);
router.delete("/:id", authMiddleware, deleteIncome);
module.exports = router;