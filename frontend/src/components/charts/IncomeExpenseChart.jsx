import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function IncomeExpenseChart({ data }) {
  const formattedData = data.map((item) => ({
    ...item,
    month: new Date(item.month + "-01").toLocaleString("default", {
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-[430px]">
      <h2 className="text-xl font-bold mb-5">
        Income vs Expense
      </h2>

      {formattedData.length === 0 ? (
        <p className="text-gray-500">
          No monthly data available.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            data={formattedData}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="4 4" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip
              formatter={(value) => [`₹${value}`, ""]}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={4}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />

            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={4}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default IncomeExpenseChart;