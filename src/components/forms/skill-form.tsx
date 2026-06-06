"use client";

import { useState } from "react";

export default function SkillForm() {
  const [name, setName] =
    useState("");

  return (
    <form className="flex gap-3">
      <input
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        placeholder="Skill"
        className="flex-1 rounded border p-3"
      />

      <button
        type="submit"
        className="rounded border px-4"
      >
        Add
      </button>
    </form>
  );
}