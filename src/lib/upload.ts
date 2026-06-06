import { cloudinary } from "./cloudinary";

export async function uploadFile(
  file: string,
  folder: string
) {
  return cloudinary.uploader.upload(
    file,
    {
      folder,
      resource_type: "auto",
    }
  );
}

export async function deleteFile(
  publicId: string
) {
  return cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: "image",
    }
  );
}