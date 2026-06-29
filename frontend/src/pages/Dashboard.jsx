import { useEffect, useState } from "react";
import {
  FaWallet,
  FaMoneyBillWave,
  FaChartPie,
  FaPiggyBank,
  FaTasks,
  FaFire,
  FaLightbulb,
} from "react-icons/fa";

import api from "../services/api";
import StatCard from "../components/StatCard";
import DashboardLayout from "../layouts/DashboardLayout";
import RecentExpenses from "../components/dashboard/RecentExpenses";
import RecentTasks from "../components/dashboard/RecentTasks";
import TodayHabits from "../components/dashboard/TodayHabits";
import ExpensePieChart from "../components/charts/ExpensePieChart";
import IncomeExpenseChart from "../components/charts/IncomeExpenseChart";

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
      <DashboardLayout>
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Dashboard Error
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-2xl">
          Loading Dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          {new Date().getHours() < 12
            ? "🌅 Good Morning!"
            : new Date().getHours() < 17
            ? "☀️ Good Afternoon!"
            : "🌙 Good Evening!"}
        </h1>

        <p className="text-lg text-gray-600 mt-2">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <p className="text-gray-500 mt-3">
          Here's your productivity and finance overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Income" value={`₹${dashboardData.totalIncome}`} color="text-green-600" icon={<FaWallet />} />
        <StatCard title="Total Expense" value={`₹${dashboardData.totalExpense}`} color="text-red-600" icon={<FaMoneyBillWave />} />
        <StatCard title="Balance" value={`₹${dashboardData.balance}`} color={dashboardData.balance >= 0 ? "text-blue-600" : "text-red-600"} icon={<FaPiggyBank />} />
        <StatCard title="Budget Used" value={`${dashboardData.budgetUsed}%`} color="text-orange-500" icon={<FaChartPie />} />
        <StatCard title="Pending Tasks" value={dashboardData.pendingTasks} color="text-yellow-600" icon={<FaTasks />} />
        <StatCard title="Completed Tasks" value={dashboardData.completedTasks} color="text-green-600" icon={<FaTasks />} />
        <StatCard title="Habits Today" value={`${dashboardData.completedHabitsToday}/${dashboardData.totalHabits}`} color="text-orange-600" icon={<FaFire />} />
        <StatCard title="Total Habits" value={dashboardData.totalHabits} color="text-purple-600" icon={<FaFire />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <IncomeExpenseChart data={dashboardData.monthlyIncomeExpenseData || []} />
        <ExpensePieChart data={dashboardData.expenseCategoryData || []} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <RecentExpenses expenses={dashboardData.recentExpenses || []} />
        <RecentTasks tasks={dashboardData.recentTasks || []} />
        <TodayHabits habits={dashboardData.todayHabits || []} />
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaLightbulb className="text-yellow-500" />
          Smart Insights
        </h2>

        {dashboardData.smartInsights?.length === 0 ? (
          <p className="text-gray-500">No insights available yet.</p>
        ) : (
          <ul className="space-y-3">
            {dashboardData.smartInsights.map((insight, index) => (
              <li
                key={index}
                className="bg-slate-50 rounded-xl px-4 py-3 text-gray-700"
              >
                {insight}
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;