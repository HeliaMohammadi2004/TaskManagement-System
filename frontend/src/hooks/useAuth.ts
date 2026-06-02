"use client";

import { useRouter } from "next/navigation";

export default function useAuth() {
  const router = useRouter();

  const isAuthenticated = () => {
    return !!localStorage.getItem("access");
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    router.push("/login");
  };

  return {
    isAuthenticated,
    logout,
  };
}