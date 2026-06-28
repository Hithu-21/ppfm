import { useEffect, useState } from "react";
import {
  FaWallet,
  FaMoneyBillWave,
  FaChartPie,
  FaPiggyBank,
} from "react-icons/fa";

import api from "../services/api";
import StatCard from "../components/StatCard";
import TaskList from "../components/TaskList";
import HabitList from "../components/HabitList";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please login again.");
        return;
      }

      const response = await api.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboardData(response.data);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Dashboard Error
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>

        <p className="text-gray-500 mb-8">
          Welcome back! Here is your productivity and finance summary.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Income"
            value={`₹${dashboardData.totalIncome}`}
            color="text-green-600"
            icon={<FaWallet />}
          />

          <StatCard
            title="Total Expense"
            value={`₹${dashboardData.totalExpense}`}
            color="text-red-600"
            icon={<FaMoneyBillWave />}
          />

          <StatCard
            title="Balance"
            value={`₹${dashboardData.balance}`}
            color={
              dashboardData.balance >= 0 ? "text-blue-600" : "text-red-600"
            }
            icon={<FaPiggyBank />}
          />

          <StatCard
            title="Budget Used"
            value={`${dashboardData.budgetUsed}%`}
            color="text-orange-500"
            icon={<FaChartPie />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <TaskList />
          <HabitList />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;