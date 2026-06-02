"use client";

import { useWorkspaces } from "@/hooks/useWorkspaces";
import WorkspaceCard from "@/components/WorkspaceCard";
import { WorkspaceSkeleton } from "@/components/WorkspaceSkeleton";
import EmptyState from "@/components/EmptyState";
import CreateWorkspaceForm from "@/components/CreateWorkspaceForm";
import { Workspace } from "@/types/api";

export default function DashboardPage() {
  const { data, isLoading, remove } = useWorkspaces();

  const handleDelete = async (id: number) => {
    if (confirm("Delete workspace permanently?")) {
      await remove.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <WorkspaceSkeleton />
        <WorkspaceSkeleton />
        <WorkspaceSkeleton />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div>
        <CreateWorkspaceForm />
        <EmptyState
          title="No workspaces yet"
          description="Create your first workspace to start organizing tasks."
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Workspaces</h1>
        <CreateWorkspaceForm />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((workspace: Workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}