import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ExpenseTable from "../components/expenses/ExpenseTable";
import ExpenseModal from "../components/expenses/ExpenseModal";

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
      alert("Failed to fetch expenses");
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
      } else {
        await addExpense(formData);
      }

      closeModal();
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete expense");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Expenses</h1>
          <p className="text-gray-500">View and manage all your expenses.</p>
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
        onDelete={handleDelete}
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
    </DashboardLayout>
  );
}

export default Expenses;