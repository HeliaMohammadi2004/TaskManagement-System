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
      <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
        <Link href={`/workspace/${workspace.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-blue-600">{workspace.name}</h3>
        </Link>
        {workspace.description && (
          <p className="text-sm text-gray-600 mb-3">{workspace.description}</p>
        )}
        <div className="flex gap-3 text-sm">
          <button
            onClick={() => setIsEditOpen(true)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(workspace.id)}
            className="text-red-600 hover:underline"
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