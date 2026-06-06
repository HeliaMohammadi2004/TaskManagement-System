"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-theme bg-theme">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 justify-between gap-4">
          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-(--accent) text-white font-semibold">
              TM
            </span>
            <span className="text-sm font-semibold text-theme">
              Task Management
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
                        <Link
              href="/dashboard"
              className="text-sm text-theme hover:underline focus:outline-none focus:ring-2 focus:ring-(--accent) rounded"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-theme hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-(--accent)"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-md bg-(--accent) px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-(--accent)"
            >
              Get started
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              aria-expanded={open}
              aria-label="Toggle menu"
              onClick={() => setOpen((s) => !s)}
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-theme hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-(--accent)"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {open ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-2 pb-4">
            <nav className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                className="block rounded px-3 py-2 text-sm text-theme hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                href="/workspace"
                className="block rounded px-3 py-2 text-sm text-theme hover:bg-slate-100"
              >
                Workspaces
              </Link>
              <Link
                href="/about"
                className="block rounded px-3 py-2 text-sm text-theme hover:bg-slate-100"
              >
                About
              </Link>
              <div className="mt-2 flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 rounded border border-theme px-3 py-2 text-center text-sm text-theme"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="flex-1 rounded bg-(--accent) px-3 py-2 text-center text-sm text-white"
                >
                  Get started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
