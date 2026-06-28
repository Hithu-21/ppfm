import { FaEdit, FaTrash } from "react-icons/fa";

function ExpenseRow({ expense, onEdit, onDelete }) {
  return (
    <tr className="border-t hover:bg-slate-50">
      <td className="p-4 font-semibold">₹{expense.amount}</td>
      <td className="p-4">{expense.category}</td>
      <td className="p-4">{expense.description || "-"}</td>
      <td className="p-4">
        {expense.date ? new Date(expense.date).toLocaleDateString() : "-"}
      </td>
      <td className="p-4">
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(expense)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit />
          </button>

          <button
            onClick={() => onDelete(expense.id)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ExpenseRow;