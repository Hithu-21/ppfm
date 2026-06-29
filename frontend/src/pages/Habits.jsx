import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";
import HabitCard from "../components/habits/HabitCard";
import HabitModal from "../components/habits/HabitModal";
import ConfirmModal from "../components/ConfirmModal";

import {
  getHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  markHabitToday,
} from "../services/habitService";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    habit_name: "",
  });

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await getHabits();

      const sortedHabits = response.data.sort((a, b) => {
        if (a.checkedToday === b.checkedToday) {
          return b.currentStreak - a.currentStreak;
        }

        return a.checkedToday - b.checkedToday;
      });

      setHabits(sortedHabits);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch habits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const completedToday = habits.filter((habit) => habit.checkedToday).length;
  const totalHabits = habits.length;

  const progressPercent =
    totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  const openAddModal = () => {
    setEditMode(false);
    setEditingId(null);
    setFormData({
      habit_name: "",
    });
    setShowModal(true);
  };

  const openEditModal = (habit) => {
    setEditMode(true);
    setEditingId(habit.id);
    setFormData({
      habit_name: habit.habit_name || "",
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
        await updateHabit(editingId, formData);
        toast.success("Habit updated successfully");
      } else {
        await addHabit(formData);
        toast.success("Habit added successfully");
      }

      closeModal();
      fetchHabits();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await markHabitToday(id);
      toast.success("Habit checked in for today");
      fetchHabits();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to check in habit");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteHabit(deleteId);

      toast.success("Habit deleted successfully");

      setShowDeleteModal(false);
      setDeleteId(null);

      fetchHabits();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete habit");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Habits</h1>
          <p className="text-gray-500">
            Build consistency with daily habit tracking.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-orange-600 text-white px-5 py-3 rounded-xl hover:bg-orange-700 transition"
        >
          + Add Habit
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold">Today's Progress</h2>
            <p className="text-gray-500 text-sm">
              {completedToday} / {totalHabits} habits completed
            </p>
          </div>

          <p className="text-3xl font-bold text-orange-600">
            {progressPercent}%
          </p>
        </div>

        <div className="w-full bg-orange-100 rounded-full h-4 overflow-hidden">
          <div
            className="bg-orange-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-xl mt-10">
          Loading Habits...
        </div>
      ) : habits.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          <h2 className="text-2xl font-bold mb-2">No habits yet</h2>
          <p className="text-gray-500 mb-5">
            Start by creating your first habit.
          </p>
          <button
            onClick={openAddModal}
            className="bg-orange-600 text-white px-5 py-3 rounded-xl hover:bg-orange-700 transition"
          >
            + Add Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={openEditModal}
              onDelete={handleDeleteClick}
              onCheckIn={handleCheckIn}
            />
          ))}
        </div>
      )}

      {showModal && (
        <HabitModal
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          closeModal={closeModal}
          editMode={editMode}
        />
      )}

      {showDeleteModal && (
        <ConfirmModal
          title="Delete Habit"
          message="Are you sure you want to delete this habit? This will also remove its check-in history."
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </DashboardLayout>
  );
}

export default Habits;