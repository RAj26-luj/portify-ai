import { prisma } from "@/lib/prisma";

import type { ParsedResume } from "@/types/parsed-resume";

function parseDate(
  value?: string
): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? undefined
    : date;
}

export async function upsertAchievements(
  portfolioId: string,
  resume: ParsedResume
) {
  if (!resume.achievements.length) {
    return [];
  }

  const results = [];

  for (const [
    index,
    achievement,
  ] of resume.achievements.entries()) {
    const existing =
      await prisma.achievement.findFirst({
        where: {
          portfolioId,
          title: achievement.title,
        },
      });

    if (existing) {
      results.push(existing);
      continue;
    }

    const created =
      await prisma.achievement.create({
        data: {
          portfolioId,
          title: achievement.title,
          description:
            achievement.description,
          issuer:
            achievement.issuer,
          achievementDate:
            parseDate(
              achievement.achievementDate
            ),
          certificateUrl:
            achievement.certificateUrl,
          rank:
            achievement.rank,
          position:
            achievement.position,
          displayOrder: index,
        },
      });

    results.push(created);
  }

  return results;
}