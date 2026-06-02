import { api } from "./api";
import { Workspace } from "@/types/api";

export interface WorkspacePayload {
  name: string;
  description?: string;
}

export const getWorkspaces =
  async (): Promise<Workspace[]> => {
    const res = await api.get(
      "/workspaces/"
    );

    return res.data;
  };

export const createWorkspace =
  async (
    data: WorkspacePayload
  ): Promise<Workspace> => {
    const res = await api.post(
      "/workspaces/",
      data
    );

    return res.data;
  };

export const updateWorkspace =
  async (
    id: number,
    data: Partial<WorkspacePayload>
  ): Promise<Workspace> => {
    const res = await api.patch(
      `/workspaces/${id}/`,
      data
    );

    return res.data;
  };

export const deleteWorkspace =
  async (
    id: number
  ): Promise<void> => {
    await api.delete(
      `/workspaces/${id}/`
    );
  };