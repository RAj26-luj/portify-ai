import { getCloudinary } from "./cloudinary.server";

const IMAGE_TYPES = ["jpg", "jpeg", "png", "webp", "gif"];
const DOCUMENT_TYPES = ["pdf", "doc", "docx"];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

export type UploadType = "image" | "video" | "document";

function validateFile(
  bytes: number,
  format: string,
  allowed: string[],
  maxSize: number
) {
  if (!allowed.includes(format.toLowerCase())) {
    throw new Error("Invalid file type");
  }

  if (bytes > maxSize) {
    throw new Error("File size limit exceeded");
  }
}

function safeRollback(
  publicId: string,
  resourceType: "image" | "video" | "raw"
) {
  const cloudinary = getCloudinary();
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}

export async function uploadImage(file: string, folder: string) {
  const cloudinary = getCloudinary();

  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "image",
  });

  try {
    validateFile(result.bytes, result.format, IMAGE_TYPES, MAX_IMAGE_SIZE);
  } catch (error) {
    await safeRollback(result.public_id, "image");
    throw error;
  }

  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    format: result.format,
    fileName: result.original_filename,
    type: "image",
  };
}

export async function uploadDocument(file: string, folder: string) {
  const cloudinary = getCloudinary();

  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "raw",
  });

  if (result.bytes > MAX_DOCUMENT_SIZE) {
    await safeRollback(result.public_id, "raw");
    throw new Error("File size limit exceeded");
  }

  return {
    publicId: result.public_id,
    url: result.secure_url,
    bytes: result.bytes,
    format: "pdf",
    fileName: result.original_filename,
    type: "document",
  };
}
export async function uploadVideo(file: string, folder: string) {
  const cloudinary = getCloudinary();

  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "video",
  });

  if (result.bytes > MAX_VIDEO_SIZE) {
    await safeRollback(result.public_id, "video");
    throw new Error("Video size limit exceeded");
  }

  return {
    publicId: result.public_id,
    url: result.secure_url,
    bytes: result.bytes,
    duration: result.duration,
    format: result.format,
    fileName: result.original_filename,
    type: "video",
  };
}

export async function deleteFile(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
) {
  const cloudinary = getCloudinary();

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}