"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const {
    theme,
    setTheme,
  } = useTheme();

  return (
    <button
      className="border px-3 py-2 rounded"
      onClick={() =>
        setTheme(
          theme === "dark"
            ? "light"
            : "dark"
        )
      }
    >
      {theme === "dark"
        ? "☀️"
        : "🌙"}
    </button>
  );
}