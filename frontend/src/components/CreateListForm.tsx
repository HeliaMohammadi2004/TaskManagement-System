"use client";

import { useState } from "react";
import { createList } from "@/services/list";

interface Props {
  workspaceId: number;
  onCreated: () => void;
}

export default function CreateListForm({
  workspaceId,
  onCreated,
}: Props) {
  const [name, setName] = useState("");

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    await createList(
      workspaceId,
      name
    );

    setName("");

    onCreated();
  };

  return (
    <form
      onSubmit={submit}
      className="min-w-[300px] bg-white p-4 rounded border"
    >
      <input
        className="border p-2 w-full"
        placeholder="List Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <button
        className="bg-black text-white px-3 py-2 mt-2 rounded"
      >
        Add List
      </button>
    </form>
  );
}