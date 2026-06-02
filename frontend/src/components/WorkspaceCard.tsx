"use client";

import Link from "next/link";
import { useState } from "react";

import { Workspace } from "@/types/api";

import EditWorkspaceModal
  from "./EditWorkspaceModal";

import {
  useDeleteWorkspace,
} from "@/hooks/useWorkspaces";

interface Props {
  workspace: Workspace;
}

export default function WorkspaceCard({
  workspace,
}: Props) {
  const [editing, setEditing] =
    useState(false);

  const deleteMutation =
    useDeleteWorkspace();

  return (
    <>
      <div
        className="
        border
        rounded-lg
        p-4
        bg-white
        "
      >
        <Link
          href={`/workspace/${workspace.id}`}
        >
          <h2
            className="
            font-bold
            text-lg
            "
          >
            {workspace.name}
          </h2>

          <p>
            {workspace.description}
          </p>
        </Link>

        <div
          className="
          flex
          gap-2
          mt-4
          "
        >
          <button
            onClick={() =>
              setEditing(true)
            }
          >
            Edit
          </button>

          <button
            className="text-red-500"
            onClick={() =>
              deleteMutation.mutate(
                workspace.id
              )
            }
          >
            Delete
          </button>
        </div>
      </div>

      {editing && (
        <EditWorkspaceModal
          workspace={workspace}
          onClose={() =>
            setEditing(false)
          }
        />
      )}
    </>
  );
}