"use client";

import { useEffect, useRef, useState } from "react";
import { Workspace } from "@/types/api";
import { useWorkspaces } from "@/hooks/useWorkspaces";

interface Props {
  workspace: Workspace;
  onClose: () => void;
}

export default function EditWorkspaceModal({ workspace, onClose }: Props) {
  const { update } = useWorkspaces();
  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description || "");
  const [error, setError] = useState<string | null>(null);

  // robust updating flag for different react-query versions
  const updateMutation = update as unknown as {
    isLoading?: boolean;
    isPending?: boolean;
    status?: string;
    mutateAsync: (args: { id: number; payload: { name: string; description: string } }) => Promise<unknown>;
  };
  const isUpdating =
    updateMutation?.isLoading === true ||
    updateMutation?.isPending === true ||
    updateMutation?.status === "pending";

  const modalRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const lastActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    // save active element to restore focus after close
    lastActiveElement.current = document.activeElement;
    // focus first input when modal opens
    const t = setTimeout(() => firstInputRef.current?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // simple focus trap
        const container = modalRef.current;
        if (!container) return;
        const focusable = container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      // restore focus
      (lastActiveElement.current as HTMLElement | null)?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Workspace name is required.");
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: workspace.id, payload: { name: name.trim(), description: description.trim() } });
      onClose();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError("Failed to update workspace");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="presentation"
      onClick={onClose}
      aria-hidden={false}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`edit-workspace-${workspace.id}-title`}
        className="relative z-10 w-full max-w-lg transform rounded-lg bg-white border border-slate-200 shadow-xl p-6 mx-4 transition-all duration-150 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 id={`edit-workspace-${workspace.id}-title`} className="text-lg font-semibold text-slate-900">
              Edit workspace
            </h2>
            <p className="text-sm text-slate-500 mt-1">Update name or description. Changes are saved to your workspace.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-(--accent)"
          >
            ✕
          </button>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="mt-4 space-y-4"
        >
          <div>
            <label htmlFor="workspace-name" className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              id="workspace-name"
              ref={firstInputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-(--accent)"
              placeholder="Workspace name"
              required
              disabled={isUpdating}
            />
          </div>

          <div>
            <label htmlFor="workspace-desc" className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              id="workspace-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-(--accent) resize-none"
              placeholder="Optional description"
              disabled={isUpdating}
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              disabled={isUpdating}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-(--accent) text-white text-sm font-medium shadow-sm hover:brightness-95 disabled:opacity-60"
              disabled={isUpdating}
            >
              {isUpdating ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}