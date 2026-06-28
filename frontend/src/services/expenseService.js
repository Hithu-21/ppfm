import api from "./api";

const getTokenConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getExpenses = () => {
  return api.get("/expenses", getTokenConfig());
};

export const addExpense = (expenseData) => {
  return api.post("/expenses", expenseData, getTokenConfig());
};

export const updateExpense = (id, expenseData) => {
  return api.put(`/expenses/${id}`, expenseData, getTokenConfig());
};

export const deleteExpense = (id) => {
  return api.delete(`/expenses/${id}`, getTokenConfig());
};