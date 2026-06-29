function HabitModal({
  formData,
  handleChange,
  handleSubmit,
  closeModal,
  editMode,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md">
        <h2 className="text-2xl font-bold mb-6">
          {editMode ? "Edit Habit" : "Add Habit"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-600 mb-2">
              Habit Name
            </label>

            <input
              type="text"
              name="habit_name"
              value={formData.habit_name}
              onChange={handleChange}
              placeholder="e.g. Read 20 Pages"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {editMode ? "Update" : "Add Habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HabitModal;