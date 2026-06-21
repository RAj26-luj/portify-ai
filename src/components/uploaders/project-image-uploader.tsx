"use client";

import FileUploader from "./file-uploader";

interface ProjectImageUploaderProps {
  onUpload: (file: File) => void;
}

export default function ProjectImageUploader({
  onUpload,
}: ProjectImageUploaderProps) {
  return (
    <FileUploader
      accept="image/*"
      multiple={false}
      onUpload={(file) => onUpload(file as File)}
    />
  );
}