import { prisma } from "@/lib/prisma";

export async function trackPortfolioView(
  portfolioId: string,
  visitorHash?: string
) {
  await prisma.$transaction(
    async (tx) => {
      const existingVisitor =
        visitorHash
          ? await tx.portfolioView.findFirst({
              where: {
                portfolioId,
                visitorHash,
              },
            })
          : null;

      await tx.portfolioView.create({
        data: {
          portfolioId,
          visitorHash,
        },
      });

      const uniqueVisitor =
        visitorHash &&
        !existingVisitor;

      await tx.analytics.upsert({
        where: {
          portfolioId,
        },
        create: {
          portfolioId,
          totalViews: 1,
          uniqueVisitors:
            uniqueVisitor
              ? 1
              : 0,
        },
        update: {
          totalViews: {
            increment: 1,
          },
          ...(uniqueVisitor
            ? {
                uniqueVisitors:
                  {
                    increment: 1,
                  },
              }
            : {}),
        },
      });

      await tx.portfolio.update({
        where: {
          id: portfolioId,
        },
        data: {
          lastViewedAt:
            new Date(),
        },
      });
    }
  );
}

export async function trackResumeDownload(
  portfolioId: string,
  visitorHash?: string
) {
  await prisma.$transaction(
    async (tx) => {
      await tx.resumeDownload.create({
        data: {
          portfolioId,
          visitorHash,
        },
      });

      await tx.analytics.upsert({
        where: {
          portfolioId,
        },
        create: {
          portfolioId,
          resumeDownloads: 1,
        },
        update: {
          resumeDownloads: {
            increment: 1,
          },
        },
      });
    }
  );
}

export async function trackProjectClick(
  portfolioId: string,
  projectId: string
) {
  await prisma.$transaction(
    async (tx) => {
      await tx.projectClick.create({
        data: {
          portfolioId,
          projectId,
        },
      });

      await tx.analytics.upsert({
        where: {
          portfolioId,
        },
        create: {
          portfolioId,
          projectClicks: 1,
        },
        update: {
          projectClicks: {
            increment: 1,
          },
        },
      });
    }
  );
}

export async function trackContactRequest(
  portfolioId: string
) {
  await prisma.analytics.upsert({
    where: {
      portfolioId,
    },
    create: {
      portfolioId,
      contactRequests: 1,
    },
    update: {
      contactRequests: {
        increment: 1,
      },
    },
  });
}

export async function getAnalytics(
  portfolioId: string
) {
  return prisma.analytics.findUnique({
    where: {
      portfolioId,
    },
  });
}

export async function getAnalyticsSummary(
  portfolioId: string
) {
  const analytics =
    await prisma.analytics.findUnique({
      where: {
        portfolioId,
      },
    });

  return {
    totalViews:
      analytics?.totalViews ??
      0,
    uniqueVisitors:
      analytics?.uniqueVisitors ??
      0,
    resumeDownloads:
      analytics?.resumeDownloads ??
      0,
    contactRequests:
      analytics?.contactRequests ??
      0,
    projectClicks:
      analytics?.projectClicks ??
      0,
  };
}