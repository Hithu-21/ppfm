import api from "./api";

const getTokenConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getHabits = () => {
  return api.get("/habits", getTokenConfig());
};

export const addHabit = (habitData) => {
  return api.post("/habits", habitData, getTokenConfig());
};

export const updateHabit = (id, habitData) => {
  return api.put(`/habits/${id}`, habitData, getTokenConfig());
};

export const deleteHabit = (id) => {
  return api.delete(`/habits/${id}`, getTokenConfig());
};

export const markHabitToday = (id) => {
  return api.post(`/habits/${id}/log`, {}, getTokenConfig());
};