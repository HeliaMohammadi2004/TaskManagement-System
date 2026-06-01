"use client";

import { useState } from "react";
import { createTask } from "@/services/task";
import { TaskPayload } from "@/types/api";

interface Props {
  listId: number;
  onCreated: () => void;
}

export default function CreateTaskForm({
  listId,
  onCreated,
}: Props) {
  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const data: TaskPayload = {
      title,
      description,
      status: "TODO",
      priority: "MEDIUM",
      order: 0,
    };

    await createTask(
      listId,
      data
    );

    setTitle("");
    setDescription("");

    onCreated();
  };

  return (
    <form
      onSubmit={submit}
      className="mt-3"
    >
      <input
        className="border p-2 w-full mb-2"
        placeholder="Task Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
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
        className="bg-blue-500 text-white px-3 py-2 rounded"
      >
        Add Task
      </button>
    </form>
  );
}