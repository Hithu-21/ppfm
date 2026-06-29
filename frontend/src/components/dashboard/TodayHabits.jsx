function TodayHabits({ habits }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">
        Today's Habits
      </h2>

      {habits.length === 0 ? (
        <p className="text-gray-500">
          No habits.
        </p>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <p className="font-semibold">
                {habit.habit_name}
              </p>

              <span className="text-xl">
                {habit.checkedToday ? "✅" : "⭕"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TodayHabits;