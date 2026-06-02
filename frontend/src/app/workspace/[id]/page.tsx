"use client";

import { useParams } from "next/navigation";
import { useLists } from "@/hooks/useLists";
import ListColumn from "@/components/ListColumn";
import CreateListForm from "@/components/CreateListForm";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = Number(params.id);
  const { data: lists, isLoading: listsLoading } = useLists(workspaceId);

  if (listsLoading) {
    return <div className="p-8">Loading workspace...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Workspace Board</h1>
          <CreateListForm workspaceId={workspaceId} />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {lists?.map((list) => (
            <ListColumn key={list.id} list={list} workspaceId={workspaceId} />
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}