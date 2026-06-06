"use client";

import FileUploader from "./file-uploader";

interface ProfileImageUploaderProps {
  onUpload: (
    file: File
  ) => void;
}

export default function ProfileImageUploader({
  onUpload,
}: ProfileImageUploaderProps) {
  return (
    <FileUploader
      accept="image/*"
      onUpload={onUpload}
    />
  );
}