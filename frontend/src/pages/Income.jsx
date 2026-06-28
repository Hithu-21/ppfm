import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import IncomeTable from "../components/income/IncomeTable";
import IncomeModal from "../components/income/IncomeModal";

import {
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
} from "../services/incomeService";

function Income() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    date: "",
  });

  const fetchIncomes = async () => {
    try {
      const response = await getIncomes();
      setIncomes(response.data);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch income records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const openAddModal = () => {
    setEditMode(false);
    setEditingId(null);
    setFormData({
      amount: "",
      source: "",
      date: "",
    });
    setShowModal(true);
  };

  const openEditModal = (income) => {
    setEditMode(true);
    setEditingId(income.id);

    setFormData({
      amount: income.amount,
      source: income.source || "",
      date: income.date ? income.date.split("T")[0] : "",
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
        await updateIncome(editingId, formData);
      } else {
        await addIncome(formData);
      }

      closeModal();
      fetchIncomes();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this income record?"
    );

    if (!confirmDelete) return;

    try {
      await deleteIncome(id);
      fetchIncomes();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete income");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Income</h1>
          <p className="text-gray-500">View and manage all your income.</p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition"
        >
          + Add Income
        </button>
      </div>

      <IncomeTable
        incomes={incomes}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {showModal && (
        <IncomeModal
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

export default Income;