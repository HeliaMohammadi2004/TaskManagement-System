import api from "./api";

export type Workspace = {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
};

export const getWorkspaces = async (): Promise<Workspace[]> => {
  const res = await api.get("/workspaces/");
  return res.data;
};

export const createWorkspace = async (payload: { name: string; description?: string }) => {
  const res = await api.post("/workspaces/", payload);
  return res.data;
};

export const updateWorkspace = async (id: number, payload: Partial<Workspace>) => {
  const res = await api.patch(`/workspaces/${id}/`, payload);
  return res.data;
};

export const deleteWorkspace = async (id: number) => {
  await api.delete(`/workspaces/${id}/`);
  return id;
};