import { api } from "./api";
import { TaskPayload } from "@/types/api";

export const getListTasks = async (
  listId: number
) => {
  const res = await api.get(
    `/lists/${listId}/tasks/`
  );

  return res.data;
};

export const createTask = async (
  listId: number,
  data: TaskPayload
) => {
  const res = await api.post(
    `/lists/${listId}/tasks/`,
    data
  );

  return res.data;
};

export const updateTask = async (
  taskId: number,
  data: Partial<TaskPayload>
) => {
  const res = await api.patch(
    `/tasks/${taskId}/`,
    data
  );

  return res.data;
};

export const deleteTask = async (
  taskId: number
) => {
  return api.delete(
    `/tasks/${taskId}/`
  );
};