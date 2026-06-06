"use client";

import { useEffect, useState } from "react";

export type TaskStatus = "TODO" | "IN PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  start_date: string;
  due_date: string;
  order: number;
}

interface CreateTaskFormProps {
  initialValues?: Partial<TaskFormData>;
  isLoading?: boolean;
  submitText?: string;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

const defaultValues: TaskFormData = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  start_date: "",
  due_date: "",
  order: 0,
};

export default function CreateTaskForm({
  initialValues,
  isLoading = false,
  submitText = "Create Task",
  onSubmit,
  onCancel,
  className = "",
}: CreateTaskFormProps) {
  const [values, setValues] = useState<TaskFormData>({
    ...defaultValues,
    ...(initialValues ?? {}),
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // if initialValues change, sync them in
    if (!initialValues) return;

    const init = initialValues as Partial<TaskFormData>;

    // shallow compare to avoid unnecessary updates
    const initialKeys = Object.keys(init) as Array<keyof TaskFormData>;
    const hasDiff = initialKeys.some((k) => init[k] !== values[k]);
    if (!hasDiff) return;

    // schedule the update after the effect to avoid synchronous setState and cascading renders
    Promise.resolve().then(() => {
      setValues((prev) => ({ ...prev, ...init }));
    });
  }, [initialValues, values]);

  const handleChange = <K extends keyof TaskFormData>(
    key: K,
    v: TaskFormData[K] | string | number,
  ) => {
    setValues((prev) => ({ ...prev, [key]: v } as TaskFormData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!values.title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      await onSubmit(values);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err) || "Failed to submit task");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
     w-full
     space-y-4
     rounded-lg
     border
     p-4
     dark:bg-zinc-900
     border-zinc-200
     dark:border-zinc-800
     ${className}
   `}
    >
      <div>
        <label className="block text-sm font-medium text-white">Title</label>
        <input
          value={values.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="
        mt-1
        w-full
        border
        p-2
        rounded
        bg-[color:var(--card-bg)]
        text-zinc-200
        border-theme
      "
          placeholder="Task title"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white">Description</label>
        <textarea
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="
        mt-1
        w-full
        border
        p-2
        rounded
        bg-[color:var(--card-bg)]
        text-zinc-200
        border-theme
      "
          placeholder="Optional description"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-white">Status</label>
          <select
            value={values.status}
            onChange={(e) => handleChange("status", e.target.value as TaskStatus)}
            className="
          mt-1
          w-full
          border
          p-2
          rounded
          bg-[color:var(--card-bg)]
          text-zinc-200
          border-theme
        "
            disabled={isLoading}
          >
            <option value="TODO">TODO</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Priority</label>
          <select
            value={values.priority}
            onChange={(e) => handleChange("priority", e.target.value as TaskPriority)}
            className="
          mt-1
          w-full
          border
          p-2
          rounded
          bg-[color:var(--card-bg)]
          text-zinc-200
          border-theme
        "
            disabled={isLoading}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-white">Start date</label>
          <input
            type="date"
            value={values.start_date}
            onChange={(e) => handleChange("start_date", e.target.value)}
            className="
          mt-1
          w-full
          border
          p-2
          rounded
          bg-[color:var(--card-bg)]
          text-zinc-200
          border-theme
        "
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Due date</label>
          <input
            type="date"
            value={values.due_date}
            onChange={(e) => handleChange("due_date", e.target.value)}
            className="
          mt-1
          w-full
          border
          p-2
          rounded
          bg-[color:var(--card-bg)]
          text-zinc-200
          border-theme
        "
            disabled={isLoading}
          />
        </div>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="
            px-3
            py-2
            rounded
            border
            border-theme
            text-theme
          "
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="
          px-4
          py-2
          rounded
          bg-[color:var(--accent)]
          text-white
          disabled:opacity-50
        "
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}
