"use client";

import FileUploader from "./file-uploader";

interface ResumeUploaderProps {
  onUpload: (
    file: File
  ) => void;
}

export default function ResumeUploader({
  onUpload,
}: ResumeUploaderProps) {
  return (
    <FileUploader
      accept=".pdf"
      onUpload={onUpload}
    />
  );
}