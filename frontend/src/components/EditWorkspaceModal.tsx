"use client";

import { useState } from "react";

import { Workspace } from "@/types/api";

import {
  useUpdateWorkspace,
} from "@/hooks/useWorkspaces";

interface Props {
  workspace: Workspace;
  onClose: () => void;
}

export default function EditWorkspaceModal({
  workspace,
  onClose,
}: Props) {
  const mutation =
    useUpdateWorkspace();

  const [name, setName] =
    useState(workspace.name);

  const [
    description,
    setDescription,
  ] = useState(
    workspace.description
  );

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    await mutation.mutateAsync({
      id: workspace.id,
      data: {
        name,
        description,
      },
    });

    onClose();
  };

  return (
    <div
      className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      "
    >
      <div
        className="
        bg-white
        p-6
        rounded-lg
        w-[450px]
        "
      >
        <h2
          className="
          text-xl
          font-bold
          mb-4
          "
        >
          Edit Workspace
        </h2>

        <form
          onSubmit={submit}
        >
          <input
            className="
            border
            p-2
            w-full
            mb-3
            "
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <textarea
            className="
            border
            p-2
            w-full
            mb-4
            "
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

          <div
            className="
            flex
            gap-2
            justify-end
            "
          >
            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="
              bg-black
              text-white
              px-4
              py-2
              rounded
              "
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}