"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  Workspace,
} from "@/services/workspace";

export const useWorkspaces = () => {
  const queryClient = useQueryClient();

  const query = useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
    staleTime: 1000 * 60,
  });

  const create = useMutation({
    mutationFn: (payload: { name: string; description?: string }) =>
      createWorkspace(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workspaces"] }),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Workspace> }) =>
      updateWorkspace(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workspaces"] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteWorkspace(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workspaces"] }),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    create,
    update,
    remove,
  };
};