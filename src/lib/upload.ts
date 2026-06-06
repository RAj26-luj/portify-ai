import { cloudinary } from "@/lib/cloudinary";

export async function uploadImage(
  file: string,
  folder: string
) {
  const result =
    await cloudinary.uploader.upload(
      file,
      {
        folder,
        resource_type: "image",
      }
    );

  return {
    publicId:
      result.public_id,

    secureUrl:
      result.secure_url,

    width:
      result.width,

    height:
      result.height,
    format:
      result.format,
  };
}

export async function uploadFile(
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

    bytes:
      result.bytes,

    format:
      result.format,
  };
}

export async function deleteFile(
  publicId: string
) {
  return cloudinary.uploader.destroy(
    publicId
  );
}