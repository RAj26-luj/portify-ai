import { prisma } from "./prisma";

type ViewData = {
  portfolioId: string;
  visitorHash?: string;
};

export async function incrementView(
  data: ViewData
) {
  const analytics =
    await prisma.analytics.upsert({
      where: {
        portfolioId:
          data.portfolioId,
      },
      update: {},
      create: {
        portfolioId:
          data.portfolioId,
      },
    });

  let isUnique = false;

  if (data.visitorHash) {
    const existing =
      await prisma.portfolioView.findFirst(
        {
          where: {
            portfolioId:
              data.portfolioId,
            visitorHash:
              data.visitorHash,
          },
        }
      );

    isUnique = !existing;
  }

  await prisma.portfolioView.create({
    data: {
      portfolioId:
        data.portfolioId,
      visitorHash:
        data.visitorHash,
    },
  });

  await prisma.analytics.update({
    where: {
      id: analytics.id,
    },
    data: {
      totalViews: {
        increment: 1,
      },

      ...(isUnique && {
        uniqueVisitors: {
          increment: 1,
        },
      }),
    },
  });

  await prisma.portfolio.update({
    where: {
      id: data.portfolioId,
    },
    data: {
      lastViewedAt:
        new Date(),
    },
  });
}

export async function incrementResumeDownload(
  portfolioId: string,
  visitorHash?: string
) {
  await prisma.resumeDownload.create({
    data: {
      portfolioId,
      visitorHash,
    },
  });

  await prisma.analytics.upsert({
    where: {
      portfolioId,
    },
    update: {
      resumeDownloads: {
        increment: 1,
      },
    },
    create: {
      portfolioId,
      resumeDownloads: 1,
    },
  });
}

export async function incrementContactRequest(
  portfolioId: string
) {
  await prisma.analytics.upsert({
    where: {
      portfolioId,
    },
    update: {
      contactRequests: {
        increment: 1,
      },
    },
    create: {
      portfolioId,
      contactRequests: 1,
    },
  });
}

export async function incrementProjectClick(
  portfolioId: string,
  projectId: string
) {
  await prisma.projectClick.create({
    data: {
      portfolioId,
      projectId,
    },
  });

  await prisma.analytics.upsert({
    where: {
      portfolioId,
    },
    update: {
      projectClicks: {
        increment: 1,
      },
    },
    create: {
      portfolioId,
      projectClicks: 1,
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