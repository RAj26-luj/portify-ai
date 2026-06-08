"use server";

import { prisma } from "@/lib/prisma";
import {
  THEME_PRESETS,
} from "@/lib/theme-presets";

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
export async function createTheme(
  portfolioId: string,
  data: {
    name: string;
    primaryColor?: string;
    secondaryColor?: string;
    font?: string;
    layout?: string;
  }
) {
  return prisma.theme.create({
    data: {
      portfolioId,
      ...data,
    },
  });
}
export async function getThemes(
  portfolioId: string
) {
  return prisma.theme.findMany({
    where: {
      portfolioId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
export async function createPresetThemes(
  portfolioId: string
) {
  const existing =
    await prisma.theme.count({
      where: {
        portfolioId,
      },
    });

  if (existing > 0) {
    return;
  }

  await prisma.theme.createMany(
    {
      data:
        THEME_PRESETS.map(
          (
            theme,
            index
          ) => ({
            portfolioId,

            ...theme,

            isActive:
              index === 0,
          })
        ),
    }
  );
}