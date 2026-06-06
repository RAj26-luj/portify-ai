"use server";

import { cloudinary } from "@/lib/cloudinary";

export async function uploadMedia(
  file: string,
  folder: string
) {
  const result =
    await cloudinary.uploader.upload(
      file,
      {
        folder,
        resource_type: "auto",
      }
    );

  return {
    publicId:
      result.public_id,

    secureUrl:
      result.secure_url,

    format:
      result.format,

    bytes:
      result.bytes,

    width:
      result.width,

    height:
      result.height,
    createdAt:
      result.created_at,
  };
}

export async function deleteMedia(
  publicId: string
) {
  return cloudinary.uploader.destroy(
    publicId
  );
}