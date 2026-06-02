"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";

interface Props {
  listId: number;
  onCreated: () => void;
  onCancel: () => void;
}

export default function CreateTaskForm({ listId, onCreated, onCancel }: Props) {
  const { create } = useTasks(listId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await create.mutateAsync({ title, description, status: "TODO", priority: "MEDIUM", order: 0 });
    setTitle("");
    setDescription("");
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded border mt-2">
      <input
        className="border p-1 w-full mb-1 text-sm"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <textarea
        className="border p-1 w-full mb-2 text-sm"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
          Add
        </button>
        <button type="button" onClick={onCancel} className="border px-2 py-1 rounded text-xs">
          Cancel
        </button>
      </div>
    </form>
  );
}