"use server";

import { prisma } from "@/lib/prisma";

export async function saveResume(
  portfolioId: string,
  fileName: string,
  fileUrl: string,
  fileSize?: number
) {
  const existing =
    await prisma.resume.findUnique({
      where: {
        portfolioId,
      },
    });

  if (existing) {
    return prisma.resume.update({
      where: {
        portfolioId,
      },
      data: {
        fileName,
        fileUrl,
        fileSize,
      },
    });
  }

  return prisma.resume.create({
    data: {
      portfolioId,
      fileName,
      fileUrl,
      fileSize,
    },
  });
}

export async function deleteResume(
  portfolioId: string
) {
  return prisma.resume.delete({
    where: {
      portfolioId,
    },
  });
}