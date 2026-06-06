"use client";

import { useState } from "react";
import Link from "next/link";
import { Workspace } from "@/types/api";
import EditWorkspaceModal from "./EditWorkspaceModal";

interface Props {
  workspace: Workspace;
  onDelete: (id: number) => void;
}

export default function WorkspaceCard({ workspace, onDelete }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <article
        className="group rounded-xl border border-theme bg-(--card) p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transform-gpu transition-all"
        aria-labelledby={`workspace-${workspace.id}-title`}
      >
        <Link href={`/workspace/${workspace.id}`} className="block">
          <h3
            id={`workspace-${workspace.id}-title`}
            className="font-semibold text-base text-theme group-hover:text-(--accent) transition-colors"
          >
            {workspace.name}
          </h3>

          {workspace.description && (
            <p className="mt-2 text-sm text-muted line-clamp-2">
              {workspace.description}
            </p>
          )}
        </Link>

        <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-theme">
          <div className="text-sm text-muted">
            <span className="font-medium text-theme">{/* optional meta */}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-theme text-sm text-theme hover:bg-(--accent) hover:text-white transition focus:outline-none focus:ring-2 focus:ring-(--accent)"
              aria-label={`Edit workspace ${workspace.name}`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="shrink-0"
                aria-hidden
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              type="button"
              onClick={() => onDelete(workspace.id)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-danger border border-transparent hover:bg-red-50 transition focus:outline-none focus:ring-2 focus:ring-red-200"
              aria-label={`Delete workspace ${workspace.name}`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="shrink-0"
                aria-hidden
              >
                <path d="M3 6h18" />
                <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </article>

      {isEditOpen && (
        <EditWorkspaceModal
          workspace={workspace}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </>
  );
}
