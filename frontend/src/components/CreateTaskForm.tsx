"use client";

import { useState } from "react";

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
}: CreateTaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    ...defaultValues,
    ...initialValues,
  });

  const [error, setError] = useState<string>("");

  const handleChange = <K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (
      formData.start_date &&
      formData.due_date &&
      new Date(formData.start_date) > new Date(formData.due_date)
    ) {
      setError("Start date cannot be after due date.");
      return;
    }

    try {
      await onSubmit(formData);
    } catch {
      setError("Something went wrong while saving the task.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
     w-full
     space-y-5
     rounded-2xl
     border
     border-zinc-200
     dark:border-zinc-800
     bg-white
     dark:bg-zinc-900
     p-4
     md:p-6
     shadow-sm
   "
    >
      {" "}
      <div>
        {" "}
        <label
          htmlFor="title"
          className="
         mb-2
         block
         text-sm
         font-medium
         text-zinc-700
         dark:text-zinc-300
       "
        >
          Title{" "}
        </label>
        <input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter task title"
          className="
        w-full
        rounded-xl
        border
        border-zinc-300
        dark:border-zinc-700
        bg-white
        dark:bg-zinc-950
        px-4
        py-3
        outline-none
        transition
        focus:ring-2
        focus:ring-blue-500
      "
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="
        mb-2
        block
        text-sm
        font-medium
        text-zinc-700
        dark:text-zinc-300
      "
        >
          Description
        </label>

        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="
        w-full
        rounded-xl
        border
        border-zinc-300
        dark:border-zinc-700
        bg-white
        dark:bg-zinc-950
        px-4
        py-3
        outline-none
        transition
        focus:ring-2
        focus:ring-blue-500
      "
        />
      </div>
      <div
        className="
      grid
      grid-cols-1
      md:grid-cols-2
      gap-4
    "
      >
        <div>
          <label className="mb-2 block text-sm font-medium">Status</label>

          <select
            value={formData.status}
            onChange={(e) =>
              handleChange("status", e.target.value as TaskStatus)
            }
            className="
          w-full
          rounded-xl
          border
          border-zinc-300
          dark:border-zinc-700
          bg-white
          dark:bg-zinc-950
          px-4
          py-3
        "
          >
            <option value="TODO">TODO</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Priority</label>

          <select
            value={formData.priority}
            onChange={(e) =>
              handleChange("priority", e.target.value as TaskPriority)
            }
            className="
          w-full
          rounded-xl
          border
          border-zinc-300
          dark:border-zinc-700
          bg-white
          dark:bg-zinc-950
          px-4
          py-3
        "
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Start Date</label>

          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => handleChange("start_date", e.target.value)}
            className="
          w-full
          rounded-xl
          border
          border-zinc-300
          dark:border-zinc-700
          bg-white
          dark:bg-zinc-950
          px-4
          py-3
        "
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Due Date</label>

          <input
            type="date"
            value={formData.due_date}
            onChange={(e) => handleChange("due_date", e.target.value)}
            className="
          w-full
          rounded-xl
          border
          border-zinc-300
          dark:border-zinc-700
          bg-white
          dark:bg-zinc-950
          px-4
          py-3
        "
          />
        </div>
      </div>
      
      {error && (
        <div
          className="
        rounded-xl
        border
        border-red-300
        bg-red-50
        p-3
        text-sm
        text-red-600
        dark:border-red-900
        dark:bg-red-950/30
      "
        >
          {error}
        </div>
      )}
      <button
        disabled={isLoading}
        type="submit"
        className="
      w-full
      rounded-xl
      bg-blue-600
      px-4
      py-3
      font-medium
      text-white
      transition
      hover:bg-blue-700
      disabled:opacity-50
    "
      >
        {isLoading ? "Saving..." : submitText}
      </button>
    </form>
  );
}
