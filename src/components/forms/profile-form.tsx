"use client";

import { useState } from "react";

export default function ProfileForm() {
  const [name, setName] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [resume, setResume] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  async function handleResumeUpload() {
    if (!resume) return;

    setLoading(true);

    try {
      const buffer =
        await resume.arrayBuffer();

      const bytes =
        new Uint8Array(buffer);

      const binary =
        Array.from(bytes)
          .map((b) =>
            String.fromCharCode(b)
          )
          .join("");

      const base64 =
        btoa(binary);

      const response =
        await fetch(
          "/api/resume/parse",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              buffer: base64,
            }),
          }
        );

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          "Failed to parse resume"
        );
      }

      const data =
        result.data;

      setName(
        data.name ?? ""
      );

      setBio(
        data.bio ?? ""
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded border p-4">
        <h2 className="mb-4 text-xl font-semibold">
          Import Resume
        </h2>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setResume(
              e.target.files?.[0] ??
                null
            )
          }
        />

        <button
          type="button"
          onClick={
            handleResumeUpload
          }
          disabled={
            loading || !resume
          }
          className="mt-4 rounded border px-4 py-2"
        >
          {loading
            ? "Parsing..."
            : "Import Resume"}
        </button>
      </div>

      <form className="space-y-4">
        <input
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          placeholder="Name"
          className="w-full rounded border p-3"
        />

        <input
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          placeholder="Title"
          className="w-full rounded border p-3"
        />

        <textarea
          value={bio}
          onChange={(e) =>
            setBio(
              e.target.value
            )
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
    </div>
  );
}