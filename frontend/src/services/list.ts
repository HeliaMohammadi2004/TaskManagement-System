import { api } from "./api";

export const getLists = async () => {
  const res = await api.get("/lists/");
  return res.data;
};

export const createList = async (
  workspace: number,
  name: string
) => {
  const res = await api.post("/lists/", {
    workspace,
    name,
  });

  return res.data;
};