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

  // avoid destructuring potential optional properties (timerStart/timerStop)
  const tasksHook = useTasks(list.id);
  const tasks = tasksHook.data;
  const isLoading = tasksHook.isLoading;
  const create = tasksHook.create;
  const remove = tasksHook.remove;
  const update = tasksHook.update;

  // access timer mutations defensively with proper types when hook may not export them
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
    if (confirm(`Delete list "${list.name}"? All tasks will be deleted.`)) {
      await deleteList.mutateAsync(list.id);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full sm:w-[320px] sm:min-w-[320px] rounded-xl bg-zinc-100 dark:bg-zinc-800/60 p-4 animate-pulse">
        <div className="h-5 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700 mb-4" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-[320px] sm:min-w-[320px] rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 p-3 shadow-sm flex flex-col">
      {/* Column header */}
      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">{list.name}</h3>
        <div className="flex items-center gap-2">
          {tasks && tasks.length > 0 && (
            <span className="rounded-full bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
              {tasks.length}
            </span>
          )}
          <button
            onClick={handleDeleteList}
            title="Delete list"
            className="rounded-lg p-1 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-2 max-h-[calc(100vh-260px)] overflow-y-auto pr-0.5 flex-1">
        {tasks?.map((task) => (
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
        ))}
        {tasks?.length === 0 && (
          <p className="text-center text-xs text-white py-6 italic">
            No tasks yet
          </p>
        )}
      </div>

      {/* Add task */}
      {!showTaskForm ? (
        <button
          onClick={() => setShowTaskForm(true)}
          className="mt-3 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-full"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add task
        </button>
      ) : (
        <div className="mt-3">
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
            className="mt-2 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 py-2 text-sm text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
