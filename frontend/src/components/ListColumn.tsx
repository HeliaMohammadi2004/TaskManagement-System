"use client";

import { useState } from "react";
import { List as ListType } from "@/types/api";
import TaskCard from "./TaskCard";
import CreateTaskForm from "./CreateTaskForm";
import { useLists } from "@/hooks/useLists";
import { useTasks } from "@/hooks/useTasks";

interface Props {
  list: ListType;
  workspaceId: number;
}

export default function ListColumn({ list, workspaceId }: Props) {
  const { remove: deleteList } = useLists(workspaceId);

  // useTasks may expose optional timer mutations — access defensively
  const tasksHook = useTasks(list.id);
  const tasks = tasksHook.data ?? [];
  const isLoading = !!tasksHook.isLoading;
  const create = tasksHook.create;
  const remove = tasksHook.remove;
  const update = tasksHook.update;

  interface TimerMutate {
    mutateAsync: (id: number) => Promise<unknown>;
    isPending?: boolean;
  }
  interface TasksHookWithTimer {
    timerStart?: TimerMutate;
    timerStop?: TimerMutate;
  }

  const { timerStart, timerStop } = tasksHook as unknown as TasksHookWithTimer;
  const isTimerStarting = timerStart?.isPending ?? false;
  const isTimerStopping = timerStop?.isPending ?? false;

  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleDeleteList = async () => {
    if (!confirm(`Delete list "${list.name}"? This will remove all tasks in the list.`)) return;
    try {
      await deleteList.mutateAsync(list.id);
    } catch (err) {
      console.error("Failed to delete list:", err);
      // optionally show toast / inline error
    }
  };

  if (isLoading) {
    return (
      <div className="w-full sm:w-[320px] sm:min-w-[320px] rounded-lg bg-white border border-gray-200 p-4 shadow-sm animate-pulse">
        <div className="h-4 w-36 rounded bg-gray-200 mb-4" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="w-full sm:w-[320px] sm:min-w-[320px] rounded-lg bg-white border border-gray-200 p-4 shadow-sm flex flex-col">
      {/* header */}
      <header className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900 truncate">{list.name}</h3>
          <p className="text-xs text-slate-500 mt-1">{(list as { description?: string }).description ?? ""}</p>
        </div>

        <div className="flex items-center gap-2">
          {tasks.length > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-slate-700">
              {tasks.length}
            </span>
          )}

          <button
            onClick={handleDeleteList}
            title="Delete list"
            className="rounded-md p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
            aria-label={`Delete list ${list.name}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18" />
              <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </button>
        </div>
      </header>

      {/* tasks list */}
      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-260px)] flex-1 pr-1">
        {tasks.length === 0 ? (
          <div className="py-8 text-center">
            <svg className="mx-auto mb-3 h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 7h18M7 7v13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7" />
              <path d="M10 3h4" />
            </svg>
            <p className="text-sm text-slate-500">No tasks yet.
              <br />
              Add your first task to get started.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={async (id: number) => {
                if (remove && typeof remove.mutateAsync === "function") {
                  await remove.mutateAsync(id);
                }
              }}
              onUpdate={async (id, data) => {
                if (update && typeof update.mutateAsync === "function") {
                  await update.mutateAsync({ id, payload: data });
                }
              }}
              onTimerStart={async (id: number) => {
                if (timerStart && typeof timerStart.mutateAsync === "function") {
                  await timerStart.mutateAsync(id);
                }
              }}
              onTimerStop={async (id: number) => {
                if (timerStop && typeof timerStop.mutateAsync === "function") {
                  await timerStop.mutateAsync(id);
                }
              }}
              isTimerStarting={isTimerStarting}
              isTimerStopping={isTimerStopping}
            />
          ))
        )}
      </div>

      {/* footer / add task */}
      <footer className="mt-4">
        {!showTaskForm ? (
          <button
            onClick={() => setShowTaskForm(true)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700 transition"
            aria-label={`Add task to ${list.name}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add task
          </button>
        ) : (
          <div className="space-y-2">
            <CreateTaskForm
              onSubmit={async (data) => {
                if (create && typeof create.mutateAsync === "function") {
                  await create.mutateAsync(data);
                }
                setShowTaskForm(false);
              }}
              submitText="Add Task"
            />
            <button
              onClick={() => setShowTaskForm(false)}
              className="w-full rounded-md border border-gray-200 py-2 text-sm text-slate-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </footer>
    </section>
  );
}
