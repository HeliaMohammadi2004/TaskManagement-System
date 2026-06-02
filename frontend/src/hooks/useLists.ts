"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLists, createList, updateList, deleteList, ListItem } from "@/services/list";

export const useLists = (workspaceId: number) => {
  const queryClient = useQueryClient();

  const query = useQuery<ListItem[]>({
    queryKey: ["lists", workspaceId],
    queryFn: () => getLists(workspaceId),
    enabled: !!workspaceId,
    staleTime: 1000 * 60,
  });

  const create = useMutation({
    mutationFn: (payload: { name: string }) => createList(workspaceId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lists", workspaceId] }),
  });

  const update = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateList(id, { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lists", workspaceId] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteList(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lists", workspaceId] }),
  });

  return { ...query, create, update, remove };
};