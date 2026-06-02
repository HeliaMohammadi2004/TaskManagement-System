"use client";

import { useState } from "react";
import { useWorkspaces } from "@/hooks/useWorkspaces";

export default function CreateWorkspaceForm() {
  const { create } = useWorkspaces();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await create.mutateAsync({ name, description });
    setName("");
    setDescription("");
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + New Workspace
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border space-y-3">
          <input
            type="text"
            placeholder="Workspace name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            rows={2}
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Create
            </button>
            <button type="button" onClick={() => setIsOpen(false)} className="border px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}