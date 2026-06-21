import { v2 as cloudinary } from "cloudinary";

export interface SavedResumeFile {
  fileName: string;
  fileUrl: string;
  publicId: string;
  fileSize: number;
}

export async function saveResumeFile(
  file: File,
  portfolioId: string
): Promise<SavedResumeFile> {
  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  const base64 = buffer.toString("base64");

  const dataUri = `data:${file.type};base64,${base64}`;

  const upload = await cloudinary.uploader.upload(
    dataUri,
    {
      folder: `portify/resumes/${portfolioId}`,
      resource_type: "raw",
      public_id: `${Date.now()}-${file.name.replace(
        /\.[^/.]+$/,
        ""
      )}`,
    }
  );

  return {
    fileName: file.name,
    fileUrl: upload.secure_url,
    publicId: upload.public_id,
    fileSize: file.size,
  };
}