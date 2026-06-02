"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { List, Task } from "@/types/api";
import { getWorkspaceLists } from "@/services/list";
import { getListTasks } from "@/services/task";
import ListColumn from "@/components/ListColumn";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function WorkspacePage() {
  const params = useParams();

  const workspaceId = Number(params.id);

  const [lists, setLists] = useState<List[]>([]);

  const [tasksMap, setTasksMap] = useState<Record<number, Task[]>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedLists = await getWorkspaceLists(workspaceId);

        setLists(fetchedLists);

        const taskStore: Record<number, Task[]> = {};

        for (const list of fetchedLists) {
          const tasks = await getListTasks(list.id);

          taskStore[list.id] = tasks;
        }

        setTasksMap(taskStore);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [workspaceId]);

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-3xl font-bold mb-8">Workspace</h1>

        <div className="flex gap-6 overflow-auto">
          {lists.map((list) => (
            <ListColumn
              key={list.id}
              title={list.name}
              tasks={tasksMap[list.id] || []}
            />
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
