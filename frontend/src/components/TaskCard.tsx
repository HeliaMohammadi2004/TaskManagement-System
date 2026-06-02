"use client";

import { useState } from "react";
import { Task } from "@/types/api";
import { useTasks } from "@/hooks/useTasks";

interface Props {
  task: Task;
  onDelete: () => void;
}

export default function TaskCard({ task, onDelete }: Props) {
  const { update, remove } = useTasks(task.list);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    setError(null);
    const payload: Record<string, unknown> = {};
    if (title !== task.title) payload.title = title;
    if (description !== (task.description || "")) payload.description = description;
    if (status !== task.status) payload.status = status;
    if (priority !== task.priority) payload.priority = priority;

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      await update.mutateAsync({ id: task.id, payload });
      setIsEditing(false);
      onDelete(); // باعث ریفرش لیست تسک‌ها می‌شود
    } catch (err: unknown) {
      console.error(err);
      type ErrorWithResponse = { response?: { data?: unknown } };
      const responseData = (err as ErrorWithResponse).response?.data;
      if (responseData && typeof responseData === "object") {
        const messages = Object.entries(responseData as Record<string, unknown>)
          .map(([field, msgs]) =>
            Array.isArray(msgs) ? `${field}: ${msgs.join(", ")}` : `${field}: ${String(msgs)}`
          )
          .join(", ");
        setError(`Update failed: ${messages}`);
      } else {
        setError("Update failed. Check console.");
      }
    }
  };

  const handleDelete = async () => {
    if (confirm("Delete task?")) {
      await remove.mutateAsync(task.id);
      onDelete();
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-3 rounded border shadow">
        {error && <div className="text-red-600 text-xs mb-2">{error}</div>}
        <input
          className="border p-1 w-full mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-1 w-full mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
        {/* اصلاح: مقادیر status دقیقاً برابر با مقادیر معتبر بک‌اند */}
        <select className="border p-1 w-full mb-2" value={status} onChange={(e) => setStatus(e.target.value as Task['status'])}>
          <option value="TODO">TODO</option>
          <option value="IN PROGRESS">IN PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
        <select className="border p-1 w-full mb-2" value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])}>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
        <div className="flex gap-2">
          <button onClick={handleUpdate} className="bg-green-600 text-white px-2 py-1 rounded text-xs">Save</button>
          <button onClick={() => setIsEditing(false)} className="border px-2 py-1 rounded text-xs">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 rounded border shadow-sm">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-sm">{task.title}</h4>
        <div className="flex gap-1">
          <button onClick={() => setIsEditing(true)} className="text-blue-500 text-xs">✎</button>
          <button onClick={handleDelete} className="text-red-500 text-xs">✕</button>
        </div>
      </div>
      {task.description && <p className="text-xs text-gray-600 mt-1">{task.description}</p>}
      <div className="flex gap-2 mt-2 text-xs">
        <span className={`px-1 rounded ${task.priority === "HIGH" ? "bg-red-100 text-red-800" : task.priority === "MEDIUM" ? "bg-yellow-100" : "bg-green-100"}`}>
          {task.priority}
        </span>
        <span className="bg-gray-200 px-1 rounded">
          {task.status === "IN PROGRESS" ? "IN PROGRESS" : task.status}
        </span>
      </div>
    </div>
  );
}