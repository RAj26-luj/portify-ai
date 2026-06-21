"use client";

import FileUploader from "./file-uploader";

interface CoverImageUploaderProps {
  onUpload: (file: File) => void;
}

export default function CoverImageUploader({
  onUpload,
}: CoverImageUploaderProps) {
  return (
    <FileUploader
      accept="image/*"
      multiple={false}
      onUpload={(file) => onUpload(file as File)}
    />
  );
}