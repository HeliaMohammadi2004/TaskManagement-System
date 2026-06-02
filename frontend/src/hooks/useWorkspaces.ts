"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from "@/services/workspace";

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });
}

export function useCreateWorkspace() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createWorkspace,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });

      toast.success(
        "Workspace created"
      );
    },

    onError: () => {
      toast.error(
        "Failed creating workspace"
      );
    },
  });
}

export function useUpdateWorkspace() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        name?: string;
        description?: string;
      };
    }) =>
      updateWorkspace(
        id,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });

      toast.success(
        "Workspace updated"
      );
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteWorkspace,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });

      toast.success(
        "Workspace deleted"
      );
    },
  });
}