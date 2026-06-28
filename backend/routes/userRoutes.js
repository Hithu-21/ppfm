const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
    registerUser,
    loginUser
} = require("../controllers/userController");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/test", authMiddleware, (req, res) => {
    res.send("Protected Route Reached");
});
module.exports = router;