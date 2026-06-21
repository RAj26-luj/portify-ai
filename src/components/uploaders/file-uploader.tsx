"use client";

import { useRef } from "react";

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  onUpload: (file: File | File[]) => void;
}

export default function FileUploader({
  accept,
  multiple = false,
  onUpload,
}: FileUploaderProps) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        className="block w-full text-sm"
        onChange={(e) => {
          const files = e.target.files;

          if (!files || files.length === 0) return;

          if (multiple) {
            onUpload(Array.from(files));
          } else {
            onUpload(files[0]);
          }

          // reset input so same file can be uploaded again
          e.target.value = "";
        }}
      />
    </div>
  );
}