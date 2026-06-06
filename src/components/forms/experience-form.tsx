"use client";

import { useState } from "react";

export default function ExperienceForm() {
  const [company, setCompany] =
    useState("");

  const [position, setPosition] =
    useState("");

  return (
    <form className="space-y-4">
      <input
        value={company}
        onChange={(e) =>
          setCompany(
            e.target.value
          )
        }
        placeholder="Company"
        className="w-full rounded border p-3"
      />

      <input
        value={position}
        onChange={(e) =>
          setPosition(
            e.target.value
          )
        }
        placeholder="Position"
        className="w-full rounded border p-3"
      />

      <button
        type="submit"
        className="rounded border px-4 py-2"
      >
        Save
      </button>
    </form>
  );
}