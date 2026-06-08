"use server";

import { prisma } from "@/lib/prisma";

import {
  logPortfolioUpdate,
} from "@/lib/audit-log";

export async function saveResume(
  userId: string,
  portfolioId: string,
  fileName: string,
  fileUrl: string,
  fileSize?: number
) {
  const portfolio =
    await prisma.portfolio.findFirst(
      {
        where: {
          id: portfolioId,
          userId,
        },
      }
    );

  if (!portfolio) {
    throw new Error(
      "Unauthorized portfolio access"
    );
  }

  const existing =
    await prisma.resume.findUnique({
      where: {
        portfolioId,
      },
    });

  const resume =
    existing
      ? await prisma.resume.update(
          {
            where: {
              portfolioId,
            },
            data: {
              fileName,
              fileUrl,
              fileSize,
            },
          }
        )
      : await prisma.resume.create(
          {
            data: {
              portfolioId,
              fileName,
              fileUrl,
              fileSize,
            },
          }
        );

  await logPortfolioUpdate(
    userId,
    {
      action:
        "resume_saved",
      fileName,
    }
  );

  return resume;
}

export async function deleteResume(
  userId: string,
  portfolioId: string
) {
  const portfolio =
    await prisma.portfolio.findFirst(
      {
        where: {
          id: portfolioId,
          userId,
        },
      }
    );

  if (!portfolio) {
    throw new Error(
      "Unauthorized portfolio access"
    );
  }

  const result =
    await prisma.resume.delete({
      where: {
        portfolioId,
      },
    });

  await logPortfolioUpdate(
    userId,
    {
      action:
        "resume_deleted",
    }
  );

  return result;
}
export async function trackResumeDownload(
  portfolioId: string,
  ipHash?: string,
  country?: string,
  city?: string
) {
  return prisma.resumeDownload.create({
    data: {
      portfolioId,
      ipHash,
      country,
      city,
    },
  });
}

export async function getResumeDownloadStats(
  portfolioId: string
) {
  const totalDownloads =
    await prisma.resumeDownload.count({
      where: {
        portfolioId,
      },
    });

  const recentDownloads =
    await prisma.resumeDownload.findMany({
      where: {
        portfolioId,
      },

      orderBy: {
        downloadedAt:
          "desc",
      },

      take: 20,
    });

  return {
    totalDownloads,
    recentDownloads,
  };
}
