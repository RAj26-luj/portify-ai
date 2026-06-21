import { v2 as cloudinary } from "cloudinary";

let configured = false;

/**
 * IMPORTANT:
 * This file MUST only be imported from:
 * - /api routes
 * - server actions
 * - server components
 */
export function getCloudinary() {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
      secure: true,
    });

    configured = true;
  }

  return cloudinary;
}

export async function deleteFile(
  publicId: string,
  resourceType: string = "image"
) {
  const cld = getCloudinary();

  return cld.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}

export const CLOUDINARY_FOLDERS = {
  profile: "portify/profiles",
  cover: "portify/covers",
  resumes: "portify/resumes",
  projects: "portify/projects",
  certificates: "portify/certificates",
  gallery: "portify/gallery",
  videos: "portify/videos",
  customSections: "portify/custom-sections",
  publications: "portify/publications",
  testimonials: "portify/testimonials",
} as const;