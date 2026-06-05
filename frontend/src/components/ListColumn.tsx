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
  const { data: tasks, isLoading, create, remove, update } = useTasks(list.id);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleDeleteList = async () => {
    if (confirm(`Delete list "${list.name}"? All tasks will be deleted.`)) {
      await deleteList.mutateAsync(list.id);
    }
  };

  const refresh = () => {
    // No need, react-query auto-refreshes
  };

  if (isLoading) return <div className="w-[320px] bg-gray-100 rounded p-3">Loading tasks...</div>;

  return (
    <div className="w-full sm:w-[320px] sm:min-w-[320px] bg-white dark:bg-zinc-900
 rounded-lg p-3 shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">{list.name}</h3>
        <button onClick={handleDeleteList} className="text-red-500 text-sm hover:text-red-700">
          ✕
        </button>
      </div>
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
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
          />
        ))}
        {tasks?.length === 0 && <p className="text-gray-500 text-sm">No tasks yet</p>}
      </div>
      {!showTaskForm ? (
        <button
          onClick={() => setShowTaskForm(true)}
          className="mt-3 text-blue-600 text-sm w-full text-left hover:underline"
        >
          + Add task
        </button>
      ) : (
        <div className="mt-3">
          <CreateTaskForm
            // CreateTaskForm expects an onSubmit that receives TaskFormData
            onSubmit={async (data) => {
              if (create && typeof create.mutateAsync === "function") {
                await create.mutateAsync(data);
              }
              setShowTaskForm(false);
            }}
            submitText="Add Task"
          />
        </div>
      )}
    </div>
  );
}