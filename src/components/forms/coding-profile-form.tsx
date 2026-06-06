"use client";

import { useState } from "react";

export default function CodingProfileForm() {
  const [platform, setPlatform] =
    useState("");

  const [username, setUsername] =
    useState("");

  return (
    <form className="space-y-4">
      <input
        value={platform}
        onChange={(e) =>
          setPlatform(
            e.target.value
          )
        }
        placeholder="Platform"
        className="w-full rounded border p-3"
      />

      <input
        value={username}
        onChange={(e) =>
          setUsername(
            e.target.value
          )
        }
        placeholder="Username"
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