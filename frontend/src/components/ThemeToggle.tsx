"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // schedule state updates on the next tick to avoid synchronous setState during the effect
    let mountedFlag = true;
    const id = window.setTimeout(() => {
      if (!mountedFlag) return;
      try {
        const stored = localStorage.getItem("theme");
        const prefersDark =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial =
          stored === "light" || stored === "dark"
            ? (stored as "light" | "dark")
            : prefersDark
            ? "dark"
            : "light";
        setTheme(initial);
        setMounted(true);
        document.documentElement.classList.toggle("dark", initial === "dark");
      } catch {
        // ignore
      }
    }, 0);

    return () => {
      mountedFlag = false;
      clearTimeout(id);
    };
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
    } catch {
      /* ignore */
    }
  };

  // stable placeholder for SSR/hydration: same markup server and initial client render
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="border px-3 py-2 rounded"
      >
        Theme
      </button>
    );
  }

  // real UI after client mount
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggle}
      className="border px-3 py-2 rounded"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}