import { prisma } from "@/lib/prisma";

interface UpsertResumeVersionInput {
  portfolioId: string;
  fileName: string;
  fileUrl: string;
}

export async function upsertResumeVersion({
  portfolioId,
  fileName,
  fileUrl,
}: UpsertResumeVersionInput) {
  return prisma.resumeVersion.create({
    data: {
      portfolioId,
      fileName,
      fileUrl,
    },
  });
}