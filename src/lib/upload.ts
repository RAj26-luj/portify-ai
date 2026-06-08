import {
  getCloudinary,
} from "@/lib/cloudinary";

const IMAGE_TYPES = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
];

const DOCUMENT_TYPES = [
  "pdf",
  "doc",
  "docx",
];

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

const MAX_FILE_SIZE =
  20 * 1024 * 1024;

function validateFile(
  bytes: number,
  format: string,
  allowed: string[],
  maxSize: number
) {
  if (
    !allowed.includes(
      format.toLowerCase()
    )
  ) {
    throw new Error(
      "Invalid file type"
    );
  }

  if (bytes > maxSize) {
    throw new Error(
      "File size limit exceeded"
    );
  }
}

export async function uploadImage(
  file: string,
  folder: string
) {const cloudinary =
  getCloudinary();
  const result =
    await cloudinary.uploader.upload(
      file,
      {
        folder,
        resource_type: "image",
      }
    );

try {
  validateFile(
    result.bytes,
    result.format,
    IMAGE_TYPES,
    MAX_IMAGE_SIZE
  );
} catch (error) {
  await cloudinary.uploader.destroy(
    result.public_id,
    {
      resource_type:
        "image",
    }
  );

  throw error;
}

  return {
    publicId:
      result.public_id,
    secureUrl:
      result.secure_url,
    width:
      result.width,
    height:
      result.height,
    bytes:
      result.bytes,
    format:
      result.format,
  };
}

export async function uploadDocument(
  file: string,
  folder: string
) {const cloudinary =
  getCloudinary();
  const result =
    await cloudinary.uploader.upload(
      file,
      {
        folder,
        resource_type: "raw",
      }
    );

try {
  validateFile(
    result.bytes,
    result.format,
    DOCUMENT_TYPES,
    MAX_FILE_SIZE
  );
} catch (error) {
  await cloudinary.uploader.destroy(
    result.public_id,
    {
      resource_type:
        "raw",
    }
  );

  throw error;
}

  return {
    publicId:
      result.public_id,
    secureUrl:
      result.secure_url,
    bytes:
      result.bytes,
    format:
      result.format,
    originalName:
      result.original_filename,
  };
}

export async function uploadVideo(
  file: string,
  folder: string
) {
  const cloudinary = getCloudinary();
  const result =
    await cloudinary.uploader.upload(
      file,
      {
        folder,
        resource_type: "video",
      }
    );

  if (
  result.bytes >
  100 * 1024 * 1024
) {
  await cloudinary.uploader.destroy(
    result.public_id,
    {
      resource_type:
        "video",
    }
  );

  throw new Error(
    "Video size limit exceeded"
  );
}

  return {
    publicId:
      result.public_id,
    secureUrl:
      result.secure_url,
    bytes:
      result.bytes,
    duration:
      result.duration,
    format:
      result.format,
  };
}

export async function deleteFile(
  publicId: string,
  resourceType:
    | "image"
    | "video"
    | "raw" = "image"
) {
  const cloudinary = getCloudinary();
  return cloudinary.uploader.destroy(
    publicId,
    {
      resource_type:
        resourceType,
    }
  );
}