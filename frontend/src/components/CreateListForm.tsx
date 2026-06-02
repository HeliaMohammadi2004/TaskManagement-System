"use client";

import { useState } from "react";
import { useLists } from "@/hooks/useLists";

interface Props {
  workspaceId: number;
  onSuccess?: () => void;
}

export default function CreateListForm({ workspaceId, onSuccess }: Props) {
  const { create } = useLists(workspaceId);
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await create.mutateAsync({ name });
    setName("");
    setIsOpen(false);
    onSuccess?.();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 text-sm hover:underline"
      >
        + Add List
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <input
        type="text"
        placeholder="List name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full rounded mb-2"
        autoFocus
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
          Create
        </button>
        <button type="button" onClick={() => setIsOpen(false)} className="border px-3 py-1 rounded text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}