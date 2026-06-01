"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b p-4 flex justify-between">
      <h1 className="font-bold">
        ClickUp Clone
      </h1>

      <div className="flex gap-4">
        <Link href="/dashboard">
          Dashboard
        </Link>

        <Link href="/login">
          Login
        </Link>
      </div>
    </nav>
  );
}