"use client";

import { Task } from "@/types/api";
import TaskCard from "./TaskCard";

interface Props {
  title: string;
  tasks: Task[];
}

export default function ListColumn({
  title,
  tasks,
}: Props) {
  return (
    <div
      className="
      w-[320px]
      min-h-[500px]
      bg-gray-100
      rounded
      p-4
      "
    >
      <h2 className="font-bold mb-4">
        {title}
      </h2>

      <div className="space-y-3">

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
          />
        ))}

      </div>

    </div>
  );
}