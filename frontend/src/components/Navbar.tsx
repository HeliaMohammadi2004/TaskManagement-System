"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="border-b p-4 flex justify-between items-center">
      <Link
        href="/dashboard"
        className="font-bold"
      >
        ClickUp Clone
      </Link>

      <div className="flex gap-3">

        <Link href="/dashboard">
          Dashboard
        </Link>

        <ThemeToggle />

      </div>
    </nav>
  );
}