import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f97316", "#ef4444", "#8b5cf6", "#facc15"];

function ExpensePieChart({ data }) {
  const chartData = data.map((item) => ({
    ...item,
    total: Number(item.total),
  }));

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-[430px]">
      <h2 className="text-xl font-bold mb-5">Expense by Category</h2>

      {chartData.length === 0 ? (
        <p className="text-gray-500">No expense data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="43%"
              outerRadius={115}
              innerRadius={50}
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ExpensePieChart;