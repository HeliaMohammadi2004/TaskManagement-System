"use client";

import { useState } from "react";
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

  const handleSave = async () => {
    await update.mutateAsync({ id: workspace.id, payload: { name, description } });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Workspace</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            className="border p-2 w-full mb-3 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <textarea
            className="border p-2 w-full mb-4 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}