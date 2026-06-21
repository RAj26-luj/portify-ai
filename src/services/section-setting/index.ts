"use server";

import { prisma } from "@/lib/prisma";

export async function getSectionSettings(portfolioId: string) {
  return prisma.sectionSetting.findMany({
    where: {
      portfolioId,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export async function getSectionSetting(sectionSettingId: string) {
  return prisma.sectionSetting.findUnique({
    where: {
      id: sectionSettingId,
    },
  });
}

export async function updateSectionSetting(
  sectionSettingId: string,
  data: {
    title?: string;
    isEnabled?: boolean;
    mandatory?: boolean;
    displayOrder?: number;
  }
) {
  const setting = await prisma.sectionSetting.findUnique({
    where: {
      id: sectionSettingId,
    },
  });

  if (!setting) {
    throw new Error("Section setting not found");
  }

  // Hardcoded layout protection rules overriding database field states
  const LOCKED_SECTIONS = ["hero", "about", "contact"];

  if (
    LOCKED_SECTIONS.includes(setting.sectionKey.toLowerCase()) &&
    data.isEnabled === false
  ) {
    throw new Error("Mandatory sections cannot be disabled");
  }

  return prisma.sectionSetting.update({
    where: {
      id: sectionSettingId,
    },
    data,
  });
}

export async function reorderSectionSettings(
  portfolioId: string,
  sectionIds: string[]
) {
  await prisma.$transaction(
    sectionIds.map((id, index) => {
      if (id.startsWith("custom-")) {
        return prisma.customSection.update({
          where: {
            id: id.replace("custom-", ""),
            portfolioId,
          },
          data: {
            displayOrder: index,
          },
        });
      }

      return prisma.sectionSetting.update({
        where: {
          id,
          portfolioId,
        },
        data: {
          displayOrder: index,
        },
      });
    })
  );

  return {
    success: true,
  };
}