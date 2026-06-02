import api from "./api";

export type ListItem = {
  id: number;
  name: string;
  workspace: number;
  created_at?: string;
};

export const getLists = async (workspaceId: number): Promise<ListItem[]> => {
  const res = await api.get(`/workspaces/${workspaceId}/lists/`);
  return res.data;
};

export const createList = async (workspaceId: number, payload: { name: string }) => {
  const res = await api.post(`/workspaces/${workspaceId}/lists/`, payload);
  return res.data;
};

export const updateList = async (id: number, payload: { name: string }) => {
  const res = await api.patch(`/lists/${id}/`, payload);
  return res.data;
};

export const deleteList = async (id: number) => {
  await api.delete(`/lists/${id}/`);
  return id;
};