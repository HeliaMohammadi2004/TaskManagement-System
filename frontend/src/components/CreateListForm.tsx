"use client";

import { useEffect, useRef, useState } from "react";
import { useLists } from "@/hooks/useLists";

interface Props {
  workspaceId: number;
  onSuccess?: () => void;
}

export default function CreateListForm({ workspaceId, onSuccess }: Props) {
  const { create } = useLists(workspaceId);
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // robust creating flag across react-query versions
  const createMutation = create as unknown as {
    isLoading?: boolean;
    isPending?: boolean;
    status?: string;
    mutateAsync: (payload: { name: string }) => Promise<unknown>;
  };

  const isCreating =
    createMutation?.isLoading === true ||
    createMutation?.isPending === true ||
    createMutation?.status === "pending";

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  // lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isOpen]);

  const open = () => {
    setError(null);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setName("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a list name.");
      return;
    }

    try {
      await createMutation.mutateAsync({ name: trimmed });
      setName("");
      setIsOpen(false);
      onSuccess?.();
    } catch (err: unknown) {
      console.error("Create list error:", err);
      if (err instanceof Error) {
        setError(err.message ?? "Failed to create list");
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Failed to create list");
      }
    }
  };

  return (
    <>
      <div className="mt-3">
        <button
          type="button"
          onClick={open}
          className="inline-flex items-center gap-2 rounded-md bg-(--accent) px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:brightness-95 transition"
          aria-expanded={isOpen}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add list
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="presentation"
          onClick={close}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Create new list"
            className="relative z-10 w-full max-w-md bg-(--card) rounded-lg border border-theme p-5 shadow-xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-medium text-theme">New list</h3>
                <p className="text-sm text-muted mt-1">Give the list a name.</p>
              </div>

              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="text-slate-400 hover:text-slate-600 rounded p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-3">
              <label className="sr-only" htmlFor="list-name">
                List name
              </label>
              <input
                id="list-name"
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Backlog, Sprint tasks"
                className="w-full rounded-md border border-theme px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-(--accent)"
                disabled={isCreating}
                aria-invalid={!!error}
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={close}
                  className="px-3 py-2 rounded-md border border-theme text-slate-700 hover:bg-slate-50"
                  disabled={isCreating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-(--accent) hover:bg-(--accent)/95 text-white shadow-sm disabled:opacity-60 flex items-center gap-2"
                  disabled={isCreating}
                  aria-busy={isCreating}
                >
                  {isCreating ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
