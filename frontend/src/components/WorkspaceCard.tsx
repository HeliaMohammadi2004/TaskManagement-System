import Link from "next/link";
import { Workspace } from "@/types/api";

interface Props {
  workspace: Workspace;
}

export default function WorkspaceCard({
  workspace,
}: Props) {
  return (
    <Link
      href={`/workspace/${workspace.id}`}
      className="border rounded p-4"
    >
      <h2 className="font-bold">
        {workspace.name}
      </h2>

      <p>{workspace.description}</p>
    </Link>
  );
}