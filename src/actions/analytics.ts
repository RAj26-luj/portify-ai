"use server";

import { prisma } from "@/lib/prisma";

export async function recordView(
  portfolioId: string,
  data?: {
    ipHash?: string;
    country?: string;
    city?: string;
    browser?: string;
    device?: string;
    referrer?: string;
  }
) {
  const existing =
    data?.ipHash
      ? await prisma.portfolioView.findFirst(
          {
            where: {
              portfolioId,
              ipHash:
                data.ipHash,
            },
          }
        )
      : null;

  await prisma.portfolioView.create(
    {
      data: {
        portfolioId,
        ipHash:
          data?.ipHash,
        country:
          data?.country,
        city:
          data?.city,
        browser:
          data?.browser,
        device:
          data?.device,
        referrer:
          data?.referrer,
        expiresAt:
          new Date(
            Date.now() +
              1000 *
                60 *
                60 *
                24 *
                30
          ),
      },
    }
  );

  await prisma.portfolio.update({
    where: {
      id: portfolioId,
    },
    data: {
      totalViews: {
        increment: 1,
      },
      ...(existing
        ? {}
        : {
            uniqueVisitors:
              {
                increment: 1,
              },
          }),
    },
  });
}

export async function getAnalytics(
  portfolioId: string
) {
  const portfolio =
    await prisma.portfolio.findUnique(
      {
        where: {
          id: portfolioId,
        },
        select: {
          totalViews: true,
          uniqueVisitors:
            true,
        },
      }
    );

const [
  messages,
  views,
  resumeDownloads,
  countries,
  devices,
  browsers,
  referrers,
] = await Promise.all([
  prisma.contactMessage.count({
    where: {
      portfolioId,
    },
  }),

  prisma.portfolioView.count({
    where: {
      portfolioId,
    },
  }),

  prisma.resumeDownload.count({
    where: {
      portfolioId,
    },
  }),

  prisma.portfolioView.groupBy({
    by: ["country"],
    where: {
      portfolioId,
    },
    _count: true,
  }),

  prisma.portfolioView.groupBy({
    by: ["device"],
    where: {
      portfolioId,
    },
    _count: true,
  }),

  prisma.portfolioView.groupBy({
    by: ["browser"],
    where: {
      portfolioId,
    },
    _count: true,
  }),

  prisma.portfolioView.groupBy({
    by: ["referrer"],
    where: {
      portfolioId,
    },
    _count: true,
  }),
]);

  return {
  totalViews:
    portfolio?.totalViews ?? 0,

  uniqueVisitors:
    portfolio?.uniqueVisitors ?? 0,

  contactMessages:
    messages,

  portfolioViews:
    views,

  resumeDownloads,

  countries,

  devices,

  browsers,

  referrers,
};
}