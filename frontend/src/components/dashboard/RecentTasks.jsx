function RecentTasks({ tasks }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">
        Recent Tasks
      </h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500">
          No tasks.
        </p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-semibold">
                  {task.title}
                </p>

                <p className="text-sm text-gray-500">
                  {task.priority}
                </p>
              </div>

              <span
                className={`text-sm font-semibold ${
                  task.status === "COMPLETED"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {task.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentTasks;