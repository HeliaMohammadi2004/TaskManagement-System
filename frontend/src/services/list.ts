import { api } from "./api";

export const getWorkspaceLists = async (
  workspaceId: number
) => {
  const res = await api.get(
    `/workspaces/${workspaceId}/lists/`
  );

  return res.data;
};

export const createList = async (
  workspaceId: number,
  name: string
) => {
  const res = await api.post(
    `/workspaces/${workspaceId}/lists/`,
    {
      name,
    }
  );

  return res.data;
};