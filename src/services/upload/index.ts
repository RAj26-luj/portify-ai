import {
  uploadFile as uploadCloudFile,
  uploadImage as uploadCloudImage,
  deleteFile,
} from "@/lib/upload";

import type {
  UploadResponse,
} from "@/types/upload";

export async function uploadFile(
  file: string,
  folder: string
): Promise<UploadResponse> {
  return uploadCloudFile(
    file,
    folder
  );
}

export async function uploadImage(
  file: string,
  folder: string
) {
  return uploadCloudImage(
    file,
    folder
  );
}

export async function removeFile(
  publicId: string
) {
  return deleteFile(
    publicId
  );
}