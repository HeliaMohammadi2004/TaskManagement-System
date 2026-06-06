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

  // Sync initialValues in a stable manner (dependency array size is constant).
  useEffect(() => {
    const initKey = initialValues ? JSON.stringify(initialValues) : "";
    if (!initKey) return;
    const init = initialValues as Partial<TaskFormData>;
    const keys = Object.keys(init) as Array<keyof TaskFormData>;
    const hasDiff = keys.some((k) => init[k] !== values[k]);
    if (!hasDiff) return;
    // schedule update to avoid synchronous setState inside effect
    Promise.resolve().then(() => setValues((prev) => ({ ...prev, ...init })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues ? JSON.stringify(initialValues) : ""]);

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
      if (err instanceof Error) setError(err.message);
      else setError(String(err) || "Failed to submit task");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-xl mx-auto ${className}`}
    >
      <div className="rounded-lg border border-gray-100 bg-white shadow-md p-6">
        <header className="mb-4">
          <h4 className="text-lg font-semibold text-slate-900">Create task</h4>
          <p className="text-sm text-slate-500 mt-1">Quickly add a task with details</p>
        </header>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Title</label>
            <input
              value={values.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-(--accent)"
              placeholder="Task title"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={values.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-(--accent)"
              placeholder="Optional description"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select
                value={values.status}
                onChange={(e) => handleChange("status", e.target.value as TaskStatus)}
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent)"
                disabled={isLoading}
              >
                <option value="TODO">TODO</option>
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Priority</label>
              <select
                value={values.priority}
                onChange={(e) => handleChange("priority", e.target.value as TaskPriority)}
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent)"
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
              <label className="block text-sm font-medium text-slate-700">Start date</label>
              <input
                type="date"
                value={values.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent)"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Due date</label>
              <input
                type="date"
                value={values.due_date}
                onChange={(e) => handleChange("due_date", e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent)"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-end gap-3 pt-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-md border border-gray-200 text-sm text-slate-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-(--accent) text-white text-sm font-medium shadow-sm hover:brightness-95 disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              {isLoading ? "Saving..." : submitText}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
