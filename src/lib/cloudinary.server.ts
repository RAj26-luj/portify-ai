import { v2 as cloudinary } from "cloudinary";

let configured = false;

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

export async function deleteFile(publicId: string, resourceType: string = "image") {
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
export function extractPublicIdFromUrl(url: string) {
  if (!url) return null;

  try {
    const parts = url.split("/upload/");

    if (parts.length < 2) {
      return null;
    }

    let path = parts[1];

    path = path.replace(/^v\d+\//, "");

    const lastDot = path.lastIndexOf(".");

    if (lastDot !== -1) {
      path = path.substring(0, lastDot);
    }

    return path;
  } catch {
    return null;
  }
}
