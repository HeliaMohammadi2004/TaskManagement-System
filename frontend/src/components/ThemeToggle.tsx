"use client";

import { useEffect, useState } from "react";

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;
    const id = window.setTimeout(() => {
      if (!active) return;
      try {
        const stored = localStorage.getItem("theme");
        const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
        const initial: "light" | "dark" =
          stored === "light" || stored === "dark"
            ? stored
            : prefersDark
            ? "dark"
            : "light";
        setTheme(initial);
        setMounted(true);
        document.documentElement.classList.toggle("dark", initial === "dark");
      } catch {
        setMounted(true);
      }
    }, 0);
    return () => {
      active = false;
      clearTimeout(id);
    };
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
    } catch {/* ignore */}
  };

  // SSR/hydration placeholder — same markup on server and first render
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-2 w-9 h-9"
      />
    );
  }

  return (
    <button
      type="button"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-2
        text-zinc-600 dark:text-zinc-300
        hover:bg-zinc-100 dark:hover:bg-zinc-800
        hover:text-zinc-900 dark:hover:text-zinc-100
        transition-colors"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
