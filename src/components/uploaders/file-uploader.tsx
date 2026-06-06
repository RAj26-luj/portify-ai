"use client";

import { useRef } from "react";

interface FileUploaderProps {
  accept?: string;
  onUpload: (file: File) => void;
}

export default function FileUploader({
  accept,
  onUpload,
}: FileUploaderProps) {
  const ref =
    useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <input
        ref={ref}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file =
            e.target.files?.[0];

          if (file) {
            onUpload(file);
          }
        }}
      />
    </div>
  );
}