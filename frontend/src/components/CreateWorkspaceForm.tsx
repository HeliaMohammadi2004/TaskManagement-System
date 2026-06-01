"use client";

import { useState } from "react";
import { createWorkspace } from "@/services/workspace";

interface Props {
  onCreated: () => void;
}

export default function CreateWorkspaceForm({
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    await createWorkspace(
      name,
      description
    );

    setName("");
    setDescription("");

    onCreated();
  };

  return (
    <form
      onSubmit={submit}
      className="border rounded p-4 bg-white mb-6"
    >
      <h2 className="font-bold mb-4">
        Create Workspace
      </h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Workspace Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <button
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </form>
  );
}