"use client";

import { useState } from "react";

export default function ProfileForm() {
  const [name, setName] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [bio, setBio] =
    useState("");

  return (
    <form className="space-y-4">
      <input
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        placeholder="Name"
        className="w-full rounded border p-3"
      />

      <input
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        placeholder="Title"
        className="w-full rounded border p-3"
      />

      <textarea
        value={bio}
        onChange={(e) =>
          setBio(e.target.value)
        }
        placeholder="Bio"
        rows={6}
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