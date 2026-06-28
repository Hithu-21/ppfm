import IncomeRow from "./IncomeRow";

function IncomeTable({ incomes, loading, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {loading ? (
        <div className="p-6 text-center text-lg">Loading Income...</div>
      ) : (
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Source</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {incomes.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No income records found.
                </td>
              </tr>
            ) : (
              incomes.map((income) => (
                <IncomeRow
                  key={income.id}
                  income={income}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default IncomeTable;