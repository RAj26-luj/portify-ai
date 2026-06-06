"use server";

import { prisma } from "@/lib/prisma";

export async function activateTheme(
  portfolioId: string,
  themeId: string
) {
  await prisma.theme.updateMany({
    where: {
      portfolioId,
    },
    data: {
      isActive: false,
    },
  });

  await prisma.theme.update({
    where: {
      id: themeId,
    },
    data: {
      isActive: true,
    },
  });

  return prisma.portfolio.update({
    where: {
      id: portfolioId,
    },
    data: {
      activeThemeId:
        themeId,
    },
  });
}

export async function getActiveTheme(
  portfolioId: string
) {
  return prisma.theme.findFirst({
    where: {
      portfolioId,
      isActive: true,
    },
  });
}