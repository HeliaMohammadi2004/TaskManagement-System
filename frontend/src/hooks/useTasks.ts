"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, deleteTask } from "@/services/task";
import { Task, TaskPayload } from "@/types/api";

export const useTasks = (listId: number) => {
  const queryClient = useQueryClient();

  const query = useQuery<Task[]>({
    queryKey: ["tasks", listId],
    queryFn: () => getTasks(listId),
    enabled: !!listId,
    staleTime: 1000 * 60,
  });

  const create = useMutation({
    mutationFn: (payload: TaskPayload) => createTask(listId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", listId] }),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<TaskPayload> }) =>
      updateTask(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", listId] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", listId] }),
  });

  return { ...query, create, update, remove };
};