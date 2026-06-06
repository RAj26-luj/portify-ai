"use client";

import { useState } from "react";

export function useUpload() {
  const [loading, setLoading] =
    useState(false);

  async function upload(
    file: string,
    folder: string,
    type:
      | "image"
      | "file" = "image"
  ) {
    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/upload",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              file,
              folder,
              type,
            }),
          }
        );

      const data =
        await response.json();

      return data.data;
    } finally {
      setLoading(false);
    }
  }

  return {
    upload,
    loading,
  };
}