"use client";

import { Task } from "@/types/api";
import { deleteTask } from "@/services/task";

interface Props {
  task: Task;
  onDelete?: () => void;
}

export default function TaskCard({
  task,
  onDelete,
}: Props) {
  const remove = async () => {
    await deleteTask(task.id);

    onDelete?.();
  };

  return (
    <div className="bg-white p-3 rounded border">

      <div className="flex justify-between">

        <h3 className="font-semibold">
          {task.title}
        </h3>

        <button
          onClick={remove}
          className="text-red-500"
        >
          ✕
        </button>

      </div>

      <p className="text-sm mt-2">
        {task.description}
      </p>

      <div className="mt-3 text-xs">
        {task.priority}
      </div>

    </div>
  );
}