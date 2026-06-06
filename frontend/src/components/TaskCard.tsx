"use client";

import React, { useState } from "react";
import TaskTimer from "./TaskTimer";

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
  started_at?: string | null;
  finished_at?: string | null;
  duration?: string | null;
  order: number;
  created_at?: string;
  updated_at?: string;
}

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, data: Partial<Task>) => Promise<void>;
  onTimerStart?: (id: number) => Promise<void>;
  onTimerStop?: (id: number) => Promise<void>;
  isTimerStarting?: boolean;
  isTimerStopping?: boolean;
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

export default function TaskCard({
  task,
  onDelete,
  onUpdate,
  onTimerStart,
  onTimerStop,
  isTimerStarting = false,
  isTimerStopping = false,
}: TaskCardProps) {
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
    if (!date) return "—";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  };

  const handleTimerStart = async (id: number) => {
    if (onTimerStart) await onTimerStart(id);
  };

  const handleTimerStop = async (id: number) => {
    if (onTimerStop) await onTimerStop(id);
  };

  return (
    <>
      <div className="group rounded-2xl border border-zinc-200 dark:border-zinc-700/60 bg-zinc-800 p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-zinc-100 leading-snug">
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              title="Edit task"
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
            >
              <Pencil size={16} />
            </button>
            <button
              disabled={isDeleting}
              onClick={handleDelete}
              title="Delete task"
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 disabled:opacity-40"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-3 flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityStyles[task.priority]}`}>
            <Flag size={11} />
            {task.priority}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[task.status]}`}>
            <CheckCircle2 size={11} />
            {task.status}
          </span>
        </div>

        {/* Dates */}
        <div className="space-y-1 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="shrink-0" />
            <span>Start: <span className="text-zinc-300">{formatDate(task.start_date)}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock3 size={13} className="shrink-0" />
            <span>Due: <span className="text-zinc-300">{formatDate(task.due_date)}</span></span>
          </div>
        </div>

        {/* Timer Section */}
        <TaskTimer
          taskId={task.id}
          startedAt={task.started_at}
          finishedAt={task.finished_at}
          duration={task.duration}
          onStart={handleTimerStart}
          onStop={handleTimerStop}
          isStarting={isTimerStarting}
          isStopping={isTimerStopping}
        />
      </div>

      {/* Edit modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
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
              className="mt-3 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
