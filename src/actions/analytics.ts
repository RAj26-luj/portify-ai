"use server";

import { prisma } from "@/lib/prisma";

export async function recordView(
  portfolioId: string
) {
  await prisma.portfolioView.create({
    data: {
      portfolioId,
    },
  });

  await prisma.portfolio.update({
    where: {
      id: portfolioId,
    },
    data: {
      totalViews: {
        increment: 1,
      },
    },
  });
}

export async function getAnalytics(
  portfolioId: string
) {
  const portfolio =
    await prisma.portfolio.findUnique({
      where: {
        id: portfolioId,
      },
      select: {
        totalViews: true,
        uniqueVisitors: true,
      },
    });

  const messages =
    await prisma.contactMessage.count(
      {
        where: {
          portfolioId,
        },
      }
    );

  const views =
    await prisma.portfolioView.count(
      {
        where: {
          portfolioId,
        },
      }
    );

  return {
    totalViews:
      portfolio?.totalViews ??
      0,

    uniqueVisitors:
      portfolio?.uniqueVisitors ??
      0,

    contactMessages:
      messages,

    portfolioViews:
      views,
  };
}