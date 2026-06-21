"use client";

import FileUploader from "./file-uploader";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

export default function ImageUploader({
  onUpload,
}: ImageUploaderProps) {
  return (
    <FileUploader
      accept="image/*"
      multiple={false}
      onUpload={(file) => onUpload(file as File)}
    />
  );
}