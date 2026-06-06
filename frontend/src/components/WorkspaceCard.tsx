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
      <div className="group rounded-xl border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-900 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
        <Link href={`/workspace/${workspace.id}`}>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {workspace.name}
          </h3>
        </Link>
        {workspace.description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2">
            {workspace.description}
          </p>
        )}
        <div className="flex gap-3 text-sm pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => setIsEditOpen(true)}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(workspace.id)}
            className="text-red-500 dark:text-red-400 hover:underline font-medium"
          >
            Delete
          </button>
        </div>
      </div>
      {isEditOpen && (
        <EditWorkspaceModal workspace={workspace} onClose={() => setIsEditOpen(false)} />
      )}
    </>
  );
}
