require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const taskRoutes = require("./routes/taskRoutes");
const habitRoutes = require("./routes/habitRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/expenses", expenseRoutes);
app.use("/incomes", incomeRoutes);
app.use("/budgets", budgetRoutes);
app.use("/tasks", taskRoutes);
app.use("/habits", habitRoutes);
app.use("/dashboard", dashboardRoutes);
app.get("/", (req, res) => {
    res.send("PPFM Backend Running!");
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
