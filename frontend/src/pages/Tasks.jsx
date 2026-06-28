import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import TaskTable from "../components/tasks/TaskTable";
import TaskModal from "../components/tasks/TaskModal";

import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "MEDIUM",
    status: "PENDING",
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const filters = {};

      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;

      const response = await getTasks(filters);
      setTasks(response.data);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter]);

  const openAddModal = () => {
    setEditMode(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      deadline: "",
      priority: "MEDIUM",
      status: "PENDING",
    });
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditMode(true);
    setEditingId(task.id);

    setFormData({
      title: task.title || "",
      description: task.description || "",
      deadline: task.deadline ? task.deadline.split("T")[0] : "",
      priority: task.priority || "MEDIUM",
      status: task.status || "PENDING",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await updateTask(editingId, formData);
      } else {
        await addTask(formData);
      }

      closeModal();
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleComplete = async (task) => {
    try {
      await updateTask(task.id, {
        status: "COMPLETED",
      });

      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Tasks</h1>
          <p className="text-gray-500">
            Track your pending and completed tasks.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          + Add Task
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priority</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>

        <button
          onClick={() => {
            setStatusFilter("");
            setPriorityFilter("");
          }}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
        >
          Clear Filters
        </button>
      </div>

      <TaskTable
        tasks={tasks}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onComplete={handleComplete}
      />

      {showModal && (
        <TaskModal
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          closeModal={closeModal}
          editMode={editMode}
        />
      )}
    </DashboardLayout>
  );
}

export default Tasks;