"use client";

import { useState } from "react";

export default function ProjectForm() {
  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  return (
    <form className="space-y-4">
      <input
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        placeholder="Project Title"
        className="w-full rounded border p-3"
      />

      <textarea
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
        placeholder="Description"
        rows={5}
        className="w-full rounded border p-3"
      />

      <button
        type="submit"
        className="rounded border px-4 py-2"
      >
        Save Project
      </button>
    </form>
  );
}