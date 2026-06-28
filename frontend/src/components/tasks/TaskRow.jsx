import { FaEdit, FaTrash } from "react-icons/fa";

function TaskRow({ task, onEdit, onDelete, onComplete }) {
  const priorityClass = {
    HIGH: "bg-red-100 text-red-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-green-100 text-green-700",
  };

  const statusClass = {
    PENDING: "bg-orange-100 text-orange-700",
    COMPLETED: "bg-green-100 text-green-700",
  };

  const isCompleted = task.status === "COMPLETED";

  return (
    <tr className="border-t hover:bg-slate-50">
      <td className="p-4">
        <input
          type="checkbox"
          checked={isCompleted}
          disabled={isCompleted}
          onChange={() => onComplete(task)}
          className="w-5 h-5 cursor-pointer"
        />
      </td>

      <td
        className={`p-4 font-semibold ${
          isCompleted ? "line-through text-gray-400" : ""
        }`}
      >
        {task.title}
      </td>

      <td className="p-4">{task.description || "-"}</td>

      <td className="p-4">
        {task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}
      </td>

      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            priorityClass[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </td>

      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusClass[task.status]
          }`}
        >
          {task.status}
        </span>
      </td>

      <td className="p-4">
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default TaskRow;