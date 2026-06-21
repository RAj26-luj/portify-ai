import { SkillLevel } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import type { ParsedResume } from "@/types/parsed-resume";

function parseSkillLevel(
  level?: string
): SkillLevel | undefined {
  if (!level) {
    return undefined;
  }

  const normalized =
    level.toUpperCase().trim();

  switch (normalized) {
    case "BEGINNER":
      return SkillLevel.BEGINNER;

    case "INTERMEDIATE":
      return SkillLevel.INTERMEDIATE;

    case "ADVANCED":
      return SkillLevel.ADVANCED;

    case "EXPERT":
      return SkillLevel.EXPERT;

    default:
      return undefined;
  }
}

export async function upsertSkills(
  portfolioId: string,
  resume: ParsedResume
) {
  if (!resume.skills.length) {
    return [];
  }

  const categories =
    await prisma.skillCategory.findMany({
      where: {
        portfolioId,
      },
    });

  const categoryMap = new Map(
    categories.map((category) => [
      category.name.toLowerCase(),
      category.id,
    ])
  );

  const results = [];

  for (const [
    index,
    skill,
  ] of resume.skills.entries()) {
    const existing =
      await prisma.skill.findFirst({
        where: {
          portfolioId,
          name: {
            equals: skill.name,
            mode: "insensitive",
          },
        },
      });

    const categoryId = skill.category
      ? categoryMap.get(
          skill.category.toLowerCase()
        )
      : undefined;

    if (existing) {
      results.push(existing);
      continue;
    }

    const created =
      await prisma.skill.create({
        data: {
          portfolioId,
          categoryId,
          name: skill.name,
          proficiency: parseSkillLevel(
            skill.proficiency
          ),
          yearsOfExperience:
            skill.yearsOfExperience,
          description: skill.description,
          tag: skill.tag,
          displayOrder: index,
        },
      });

    results.push(created);
  }

  return results;
}