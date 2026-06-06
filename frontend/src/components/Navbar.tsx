"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-theme bg-theme p-4 flex justify-between items-center">
      <Link href="/dashboard" className="font-bold text-theme">
        App
      </Link>

      <div className="flex gap-3 items-center">
        <Link href="/dashboard" className="text-theme hover:underline">
          Dashboard
        </Link>
        <Link href="/login" className="text-theme hover:underline">
          Login
        </Link>
      </div>
    </nav>
  );
}
