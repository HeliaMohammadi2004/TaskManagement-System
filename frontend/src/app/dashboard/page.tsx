"use client";

import { useEffect, useState } from "react";
import { Workspace } from "@/types/api";
import { getWorkspaces } from "@/services/workspace";
import WorkspaceCard from "@/components/WorkspaceCard";

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    // تعریف تابع آسنکرون داخل useEffect
    async function loadWorkspaces() {
      try {
        const data = await getWorkspaces();
        setWorkspaces(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadWorkspaces(); // فراخوانی تابع
  }, []); // وابستگی خالی = فقط یک بار بعد از mount

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Workspaces</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
      </div>
    </div>
  );
}