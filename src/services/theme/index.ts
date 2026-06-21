import { prisma } from "@/lib/prisma";
import { themes } from "@/constants/themes";
import {
  ThemeType,
} from "@prisma/client";
import type {
  Prisma,
} from "@prisma/client";

export async function getThemes() {
  return themes;
}

export async function getThemeById(
  id: string
) {
  return themes.find(
    (theme) =>
      String(theme.id) === id
  );
}

export async function getPortfolioTheme(
  portfolioId: string
) {
  return prisma.themePreference.findUnique({
    where: {
      portfolioId,
    },
  });
}

export async function activateTheme(
  portfolioId: string,
  theme: ThemeType
) {
  const result =
    await prisma.themePreference.upsert({
      where: {
        portfolioId,
      },
      update: {
        activeTheme:
          theme,
      },
      create: {
        portfolioId,
        activeTheme:
          theme,
      },
    });

  await prisma.themeHistory.create({
    data: {
      portfolioId,
      themeName:
        theme,
    },
  });

  return result;
}



export async function updateThemeConfig(
  portfolioId: string,
  config: Prisma.InputJsonValue
) {
  return prisma.themePreference.upsert({
    where: {
      portfolioId,
    },
    update: {
      config,
    },
    create: {
      portfolioId,
      config,
    },
  });
}

export async function getThemeHistory(
  portfolioId: string
) {
  return prisma.themeHistory.findMany({
    where: {
      portfolioId,
    },
    orderBy: {
      changedAt:
        "desc",
    },
  });
}