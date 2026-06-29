import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";
import ExpenseTable from "../components/expenses/ExpenseTable";
import ExpenseModal from "../components/expenses/ExpenseModal";
import ConfirmModal from "../components/ConfirmModal";

import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseService";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const fetchExpenses = async () => {
    try {
      const response = await getExpenses();
      setExpenses(response.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const openAddModal = () => {
    setEditMode(false);
    setEditingId(null);

    setFormData({
      amount: "",
      category: "",
      description: "",
      date: "",
    });

    setShowModal(true);
  };

  const openEditModal = (expense) => {
    setEditMode(true);
    setEditingId(expense.id);

    setFormData({
      amount: expense.amount,
      category: expense.category || "",
      description: expense.description || "",
      date: expense.date ? expense.date.split("T")[0] : "",
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
        await updateExpense(editingId, formData);
        toast.success("Expense updated successfully");
      } else {
        await addExpense(formData);
        toast.success("Expense added successfully");
      }

      closeModal();
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteExpense(deleteId);

      toast.success("Expense deleted successfully");

      setShowDeleteModal(false);
      setDeleteId(null);

      fetchExpenses();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete expense"
      );
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
          <h1 className="text-4xl font-bold mb-2">Expenses</h1>

          <p className="text-gray-500">
            View and manage all your expenses.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          + Add Expense
        </button>
      </div>

      <ExpenseTable
        expenses={expenses}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDeleteClick}
      />

      {showModal && (
        <ExpenseModal
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          closeModal={closeModal}
          editMode={editMode}
        />
      )}

      {showDeleteModal && (
        <ConfirmModal
          title="Delete Expense"
          message="Are you sure you want to delete this expense? This action cannot be undone."
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </DashboardLayout>
  );
}

export default Expenses;