"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm px-4 py-3 flex justify-between items-center">
      <Link
        href="/dashboard"
        className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        TaskFlow
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          Dashboard
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
