"use server";

import { deleteFile } from "@/lib/upload";
import { extractPublicIdFromUrl } from "@/lib/cloudinary.server";

export async function deleteCloudinaryUrl(url: string, resourceType: "image" | "raw" = "image") {
  if (!url) return;

  const publicId = extractPublicIdFromUrl(url);

  if (!publicId) return;

  await deleteFile(publicId, resourceType);
}
