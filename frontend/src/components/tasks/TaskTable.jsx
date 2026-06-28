import TaskRow from "./TaskRow";

function TaskTable({ tasks, loading, onEdit, onDelete, onComplete }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {loading ? (
        <div className="p-6 text-center text-lg">Loading Tasks...</div>
      ) : (
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Done</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Deadline</th>
              <th className="p-4 text-left">Priority</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No tasks found.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onComplete={onComplete}
                />
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TaskTable;