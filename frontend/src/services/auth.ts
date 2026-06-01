import { api } from "./api";

export const loginUser = async (
  username: string,
  password: string
) => {
  const res = await api.post("/token/", {
    username,
    password,
  });

  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);

  return res.data;
};

export const registerUser = async (
  username: string,
  password: string
) => {
  const res = await api.post("/register/", {
    username,
    password,
  });

  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};