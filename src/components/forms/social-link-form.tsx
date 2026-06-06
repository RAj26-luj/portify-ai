"use client";

import { useState } from "react";

export default function SocialLinkForm() {
  const [platform, setPlatform] =
    useState("");

  const [url, setUrl] =
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
        value={url}
        onChange={(e) =>
          setUrl(e.target.value)
        }
        placeholder="URL"
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