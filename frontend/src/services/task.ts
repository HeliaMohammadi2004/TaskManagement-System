import api from "./api";
import { TaskPayload } from "@/types/api";

export const getTasks = async (listId: number) => {
  const res = await api.get(`/lists/${listId}/tasks/`);
  return res.data;
};

export const createTask = async (listId: number, payload: TaskPayload) => {
  const res = await api.post(`/lists/${listId}/tasks/`, payload);
  return res.data;
};

export const updateTask = async (id: number, payload: Partial<TaskPayload>) => {
  const res = await api.patch(`/tasks/${id}/`, payload);
  return res.data;
};

export const deleteTask = async (id: number) => {
  await api.delete(`/tasks/${id}/`);
  return id;
};