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
  return prisma.analytics.findUnique({
    where: {
      portfolioId,
    },
  });
}