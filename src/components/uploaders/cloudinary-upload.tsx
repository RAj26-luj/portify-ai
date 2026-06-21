"use client";

import { useState } from "react";
import { useUpload } from "@/hooks/use-upload";
import { fileToBase64 } from "./utils";

interface CloudinaryUploadProps {
  folder: string;
  type?: "image" | "document" | "video";

  // NEW (fixes your error)
  value?: string;
  onChange?: (url: string) => void;

  // existing pattern
  onSuccess?: (data: {
    publicId: string;
    url: string;
  }) => void;
}

export default function CloudinaryUpload({
  folder,
  type = "image",
  value,
  onChange,
  onSuccess,
}: CloudinaryUploadProps) {
  const { upload, loading } = useUpload();
  const [error, setError] = useState<string>("");

async function handleFile(file: File) {
  try {
    setError("");

    const result = await upload(file, folder, type);

    onChange?.(result.url);
    onSuccess?.(result);
  } catch {
    setError("Upload failed");
  }
}
  return (
    <div className="space-y-2">
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {value && (
        <div className="mb-2">
          <img
            src={value}
            alt="upload-preview"
            className="w-20 h-20 object-cover rounded border"
          />
        </div>
      )}

      <input
        type="file"
        accept={type === "image" ? "image/*" : "*"}
        disabled={loading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
        className="block w-full text-sm"
      />
    </div>
  );
}