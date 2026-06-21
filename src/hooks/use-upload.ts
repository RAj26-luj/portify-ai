"use client";

import { useState, useCallback } from "react";

type UploadType = "image" | "document" | "video";

export type UploadResult = {
  publicId: string;
  url: string;
  name?: string;
  size?: number;
  type?: UploadType;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export function useUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (
      file: File,
      folder: string,
      type: UploadType = "image"
    ): Promise<UploadResult> => {
      setLoading(true);
      setError(null);

      try {
        const base64 = await fileToBase64(file);

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file: base64,
            folder,
            type,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
         throw new Error(
  data?.message ||
  data?.error ||
  "Upload failed"
);
        }

        if (!data?.data?.publicId || !data?.data?.url) {
          throw new Error("Invalid upload response");
        }

        return {
          publicId: data.data.publicId,
          url: data.data.url,
          name: data.data.name,
          size: data.data.size,
          type: data.data.type,
        };
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    upload,
    loading,
    error,
  };
}