"use client";

import { useState } from "react";

import { useUpload } from "@/hooks/use-upload";

import { fileToBase64 } from "./utils";

interface CloudinaryUploadProps {
  folder: string;

  type?:
    | "image"
    | "file";

  onSuccess: (
    data: {
      publicId: string;
      secureUrl: string;
    }
  ) => void;
}

export default function CloudinaryUpload({
  folder,
  type = "image",
  onSuccess,
}: CloudinaryUploadProps) {
  const { upload, loading } =
    useUpload();

  const [error, setError] =
    useState("");

  async function handleFile(
    file: File
  ) {
    try {
      setError("");

      const base64 =
        await fileToBase64(
          file
        );

      const result =
        await upload(
          base64,
          folder,
          type
        );

      onSuccess(result);
    } catch {
      setError(
        "Upload failed"
      );
    }
  }

  return (
    <div>
      {error && (
        <p>{error}</p>
      )}
    </div>
  );

}