import api from "./api";

const getTokenConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getTasks = (filters = {}) => {
  return api.get("/tasks", {
    ...getTokenConfig(),
    params: filters,
  });
};

export const addTask = (taskData) => {
  return api.post("/tasks", taskData, getTokenConfig());
};

export const updateTask = (id, taskData) => {
  return api.put(`/tasks/${id}`, taskData, getTokenConfig());
};

export const deleteTask = (id) => {
  return api.delete(`/tasks/${id}`, getTokenConfig());
};