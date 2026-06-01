import { api } from "./api";

export const getWorkspaces = async () => {
  const res = await api.get("/workspaces/");
  return res.data;
};

export const createWorkspace = async (
  name: string,
  description: string
) => {
  const res = await api.post("/workspaces/", {
    name,
    description,
  });

  return res.data;
};