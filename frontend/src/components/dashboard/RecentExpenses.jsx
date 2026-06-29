function RecentExpenses({ expenses }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>

      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses yet.</p>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-semibold">{expense.category}</p>

                <p className="text-sm text-gray-500">
                  {expense.description || "-"}
                </p>
              </div>

              <p className="font-bold text-red-600">
                ₹{expense.amount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentExpenses;