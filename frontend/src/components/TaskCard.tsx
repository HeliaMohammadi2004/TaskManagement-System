import { Task } from "@/types/api";

interface Props {
  task: Task;
}

export default function TaskCard({
  task,
}: Props) {
  return (
    <div className="bg-white border rounded p-3">
      <h3 className="font-semibold">
        {task.title}
      </h3>

      <p className="text-sm">
        {task.description}
      </p>

      <span>
        {task.priority}
      </span>
    </div>
  );
}