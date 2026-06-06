"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, deleteTask, startTimer, stopTimer } from "@/services/task";
import { Task, TaskPayload } from "@/types/api";

export const useTasks = (listId: number) => {
  const queryClient = useQueryClient();

  const query = useQuery<Task[]>({
    queryKey: ["tasks", listId],
    queryFn: () => getTasks(listId),
    enabled: !!listId,
    staleTime: 1000 * 30, // کاهش به 30 ثانیه
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

  const timerStart = useMutation({
    mutationFn: (id: number) => startTimer(id),
    onSuccess: () =>
      // refetchQueries به جای invalidateQueries — بلافاصله fetch میکنه صرف‌نظر از staleTime
      queryClient.refetchQueries({ queryKey: ["tasks", listId] }),
  });

  const timerStop = useMutation({
    mutationFn: (id: number) => stopTimer(id),
    onSuccess: () =>
      queryClient.refetchQueries({ queryKey: ["tasks", listId] }),
  });

  return { ...query, create, update, remove, timerStart, timerStop };
};
