"use client";

import { useEffect, useRef, useState } from "react";
import { useWorkspaces } from "@/hooks/useWorkspaces";

export default function CreateWorkspaceForm() {
  const { create } = useWorkspaces();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // derive a robust creating flag (react-query versions vary)
  type CreateMutationLike = {
    status?: "idle" | "pending" | "success" | "error" | string;
    isPending?: boolean;
    isLoading?: boolean;
  };

  const createMutation = create as unknown as CreateMutationLike;

  const isCreating =
    createMutation.status === "pending" ||
    createMutation.isPending === true ||
    createMutation.isLoading === true;

  useEffect(() => {
    if (isOpen) {
      // Defer state update and focus to avoid synchronous state update inside effect
      const t = setTimeout(() => {
        setError(null);
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(t);
    }
    // no cleanup needed when closed
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Please enter a workspace name.");
      return;
    }

    try {
      await create.mutateAsync({ name: name.trim(), description: description.trim() });
      setName("");
      setDescription("");
      setIsOpen(false);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Failed to create workspace");
      }
    }
  };

  return (
    <div className="mb-6">
      {/* Primary action — placed so it is visually prominent */}
      <div className="flex items-center justify-between gap-4">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow-sm transition"
            aria-expanded="false"
          >
            + New Workspace
          </button>
        )}
      </div>

      {/* Modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-hidden={false}
          role="presentation"
          onClick={() => setIsOpen(false)} // click on backdrop closes
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Create new workspace"
            className="relative z-10 w-full max-w-xl bg-white rounded-lg border border-slate-200 shadow-xl p-5 mx-4"
            onClick={(e) => e.stopPropagation()} // prevent backdrop clicks from closing when interacting with modal
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-medium text-slate-900">Create workspace</h3>
                <p className="text-sm text-slate-500 mt-1">Give your workspace a name and optional description.</p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close create workspace"
                className="text-slate-400 hover:text-slate-600 rounded p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-3">
              <label className="sr-only" htmlFor="workspace-name">
                Workspace name
              </label>
              <input
                id="workspace-name"
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Workspace name"
                className="w-full rounded-md border border-slate-200 px-3 py-2 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
                disabled={isCreating}
                aria-required
              />

              <label className="sr-only" htmlFor="workspace-desc">
                Description
              </label>
              <textarea
                id="workspace-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={3}
                className="w-full rounded-md border border-slate-200 px-3 py-2 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none"
                disabled={isCreating}
              />

              {error && <div className="text-sm text-red-600">{error}</div>}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="px-3 py-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
                  disabled={isCreating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white shadow-sm disabled:opacity-60 flex items-center gap-2"
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
    </div>
  );
}