import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {

    const [dashboardData, setDashboardData] = useState(null);

    const fetchDashboard = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setDashboardData(response.data);

        }
        catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        fetchDashboard();

    }, []);

    if (!dashboardData) {

        return (
            <div className="min-h-screen flex items-center justify-center text-2xl">
                Loading Dashboard...
            </div>
        );

    }

    return (

        <div className="min-h-screen bg-slate-100 p-8">

            <h1 className="text-4xl font-bold mb-8">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-gray-500">
                        Total Income
                    </h2>

                    <p className="text-3xl font-bold text-green-600 mt-2">
                        ₹ {dashboardData.totalIncome}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">

                    <h2 className="text-gray-500">
                        Total Expense
                    </h2>

                    <p className="text-3xl font-bold text-red-600 mt-2">
                        ₹ {dashboardData.totalExpense}
                    </p>

                </div>

                <div className="bg-white rounded-xl shadow-md p-6">

                    <h2 className="text-gray-500">
                        Balance
                    </h2>

                    <p className={`text-3xl font-bold mt-2 ${
                        dashboardData.balance >= 0
                            ? "text-blue-600"
                            : "text-red-600"
                    }`}>
                        ₹ {dashboardData.balance}
                    </p>

                </div>

                <div className="bg-white rounded-xl shadow-md p-6">

                    <h2 className="text-gray-500">
                        Budget Used
                    </h2>

                    <p className="text-3xl font-bold text-orange-500 mt-2">
                        {dashboardData.budgetUsed}%
                    </p>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;