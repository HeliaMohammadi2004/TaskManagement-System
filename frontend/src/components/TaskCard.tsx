"use client";

import React, { useState } from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const IconBase = ({ size = 16, className = "", children, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={true}
    {...rest}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    {children}
  </svg>
);

const Calendar = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </IconBase>
);

const Clock3 = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </IconBase>
);

const Pencil = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M3 21l3-1 11-11a2.828 2.828 0 10-4-4L3 16v5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </IconBase>
);

const Trash2 = (props: IconProps) => (
  <IconBase {...props}>
    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 6V4h6v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </IconBase>
);

const Flag = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M5 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 4c2-1 5-1 7 0s5 1 7 0v9c-2 1-5 1-7 0s-5-1-7 0V4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </IconBase>
);

const CheckCircle2 = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </IconBase>
);

import CreateTaskForm, { TaskFormData } from "./CreateTaskForm";

export interface Task {
  id: number;
  list: number;
  title: string;
  description?: string;
  status: "TODO" | "IN PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  start_date?: string;
  due_date?: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, data: Partial<Task>) => Promise<void>;
}

const priorityStyles = {
  LOW: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  HIGH: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const statusStyles = {
  TODO: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  "IN PROGRESS": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  DONE: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
};

export default function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (data: TaskFormData) => {
    await onUpdate(task.id, data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date?: string): string => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
  };

  return (
    <>
      <div className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {task.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800"
            >
              <Pencil size={18} />
            </button>
            <button
              disabled={isDeleting}
              onClick={handleDelete}
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}>
            <Flag size={12} className="inline mr-1" />
            {task.priority}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[task.status]}`}>
            <CheckCircle2 size={12} className="inline mr-1" />
            {task.status}
          </span>
        </div>

        <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>Start: {formatDate(task.start_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 size={14} />
            <span>Due: {formatDate(task.due_date)}</span>
          </div>
          {task.created_at && <div>Created: {formatDate(task.created_at)}</div>}
          {task.updated_at && <div>Updated: {formatDate(task.updated_at)}</div>}
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
            <CreateTaskForm
              submitText="Update Task"
              initialValues={{
                title: task.title,
                description: task.description ?? "",
                status: task.status,
                priority: task.priority,
                start_date: task.start_date ?? "",
                due_date: task.due_date ?? "",
                order: task.order,
              }}
              onSubmit={handleUpdate}
            />
            <button
              onClick={() => setIsEditing(false)}
              className="mt-4 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 py-3 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}