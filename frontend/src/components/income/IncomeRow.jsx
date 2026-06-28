import { FaEdit, FaTrash } from "react-icons/fa";

function IncomeRow({ income, onEdit, onDelete }) {
  return (
    <tr className="border-t hover:bg-slate-50">
      <td className="p-4 font-semibold text-green-600">₹{income.amount}</td>
      <td className="p-4">{income.source}</td>
      <td className="p-4">
        {income.date ? new Date(income.date).toLocaleDateString() : "-"}
      </td>
      <td className="p-4">
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(income)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit />
          </button>

          <button
            onClick={() => onDelete(income.id)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default IncomeRow;