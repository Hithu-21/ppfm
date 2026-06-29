import {
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaFire,
  FaTrophy,
} from "react-icons/fa";

function HabitCard({ habit, onEdit, onDelete, onCheckIn }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaFire className="text-orange-500" />
            {habit.habit_name}
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Created on{" "}
            {habit.created_at
              ? new Date(habit.created_at).toLocaleDateString()
              : "-"}
          </p>
        </div>
      </div>

      {/* Current Streak */}
      <div className="bg-orange-50 rounded-xl p-4 mb-4">
        <p className="text-gray-500 text-sm">🔥 Current Streak</p>

        <p className="text-3xl font-bold text-orange-600 mt-1">
          {habit.currentStreak} Day{habit.currentStreak !== 1 ? "s" : ""}
        </p>

        <div className="mt-3 text-sm text-gray-600 space-y-1">
          <p className="flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Best Streak:
            <span className="font-semibold">
              {habit.maxStreak} Day{habit.maxStreak !== 1 ? "s" : ""}
            </span>
          </p>

          <p>
            ✅ Total Check-ins:
            <span className="font-semibold ml-1">
              {habit.totalCheckins}
            </span>
          </p>
        </div>
      </div>

      {habit.checkedToday ? (
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 bg-gray-400 text-white py-3 rounded-xl cursor-not-allowed mb-4"
        >
          <FaCheckCircle />
          Checked Today
        </button>
      ) : (
        <button
          onClick={() => onCheckIn(habit.id)}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition mb-4"
        >
          <FaCheckCircle />
          Check In Today
        </button>
      )}

      <div className="flex justify-end gap-4">
        <button
          onClick={() => onEdit(habit)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <FaEdit />
          Edit
        </button>

        <button
          onClick={() => onDelete(habit.id)}
          className="flex items-center gap-2 text-red-600 hover:text-red-800"
        >
          <FaTrash />
          Delete
        </button>
      </div>
    </div>
  );
}

export default HabitCard;