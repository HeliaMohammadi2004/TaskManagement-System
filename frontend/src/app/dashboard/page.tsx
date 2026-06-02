"use client";

import { useWorkspaces } from "@/hooks/useWorkspaces";

import WorkspaceCard from "@/components/WorkspaceCard";

// changed to named import
import { WorkspaceSkeleton } from "@/components/WorkspaceSkeleton";

import EmptyState from "@/components/EmptyState";

export default function DashboardPage() {
  const { data, isLoading } = useWorkspaces();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-4">
        <WorkspaceSkeleton />
        <WorkspaceSkeleton />
        <WorkspaceSkeleton />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No Workspaces"
        description="Create your first workspace."
      />
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Workspaces</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {data.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
      </div>
    </div>
  );
}
