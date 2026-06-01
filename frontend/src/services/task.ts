import { api } from "./api";

export const getTasks = async () => {
  const res = await api.get("/tasks/");
  return res.data;
};

export const createTask = async (data: any) => {
  const res = await api.post("/tasks/", data);
  return res.data;
};

export const updateTask = async (
  id: number,
  data: any
) => {
  const res = await api.patch(
    `/tasks/${id}/`,
    data
  );

  return res.data;
};