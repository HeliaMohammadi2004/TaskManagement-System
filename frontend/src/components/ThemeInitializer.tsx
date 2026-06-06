"use client";

import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      const theme =
        stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";

      const root = document.documentElement;
      root.classList.toggle("dark", theme === "dark");
      root.style.setProperty("color-scheme", theme === "dark" ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, []);

  return null;
}