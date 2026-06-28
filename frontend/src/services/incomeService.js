import api from "./api";

const getTokenConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getIncomes = () => {
  return api.get("/incomes", getTokenConfig());
};

export const addIncome = (incomeData) => {
  return api.post("/incomes", incomeData, getTokenConfig());
};

export const updateIncome = (id, incomeData) => {
  return api.put(`/incomes/${id}`, incomeData, getTokenConfig());
};

export const deleteIncome = (id) => {
  return api.delete(`/incomes/${id}`, getTokenConfig());
};