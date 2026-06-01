"use client";

import { useEffect, useState, useCallback } from "react";
import { Workspace } from "@/types/api";
import { getWorkspaces } from "@/services/workspace";
import WorkspaceCard from "@/components/WorkspaceCard";
import CreateWorkspaceForm from "@/components/CreateWorkspaceForm";

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const loadWorkspaces = useCallback(async () => {
    try {
      const data = await getWorkspaces();
      setWorkspaces(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getWorkspaces();
        if (mounted) setWorkspaces(data);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Workspaces</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <CreateWorkspaceForm onCreated={loadWorkspaces} />
        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
      </div>
    </div>
  );
}
