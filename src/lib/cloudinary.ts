import { v2 as cloudinary } from "cloudinary";

let configured = false;

export function getCloudinary() {
  if (!configured) {
    const cloudName =
      process.env
        .CLOUDINARY_CLOUD_NAME;

    const apiKey =
      process.env
        .CLOUDINARY_API_KEY;

    const apiSecret =
      process.env
        .CLOUDINARY_API_SECRET;

    if (
      !cloudName ||
      !apiKey ||
      !apiSecret
    ) {
      throw new Error(
        "Cloudinary environment variables are missing"
      );
    }

    cloudinary.config({
      cloud_name:
        cloudName,
      api_key: apiKey,
      api_secret:
        apiSecret,
      secure: true,
    });

    configured = true;
  }

  return cloudinary;
}

export const CLOUDINARY_FOLDERS = {
  profile:
    "portify/profile",
  cover:
    "portify/cover",
  projects:
    "portify/projects",
  certificates:
    "portify/certificates",
  gallery:
    "portify/gallery",
  resumes:
    "portify/resumes",
  videos:
    "portify/videos",
} as const;