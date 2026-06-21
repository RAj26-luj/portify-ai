import { prisma } from "@/lib/prisma";

import type { ParsedResume } from "@/types/parsed-resume";

export async function upsertSkillCategories(
  portfolioId: string,
  resume: ParsedResume
) {
  const categoryNames = [
    ...new Set(
      resume.skills
        .map((skill) => skill.category?.trim())
        .filter(
          (category): category is string =>
            Boolean(category)
        )
    ),
  ];

  if (!categoryNames.length) {
    return [];
  }

  const existingCategories =
    await prisma.skillCategory.findMany({
      where: {
        portfolioId,
      },
    });

  const existingMap = new Map(
    existingCategories.map((category) => [
      category.name.toLowerCase(),
      category,
    ])
  );

  const categories = [];

  for (const [index, name] of categoryNames.entries()) {
    const existing =
      existingMap.get(name.toLowerCase());

    if (existing) {
      categories.push(existing);
      continue;
    }

    const created =
      await prisma.skillCategory.create({
        data: {
          portfolioId,
          name,
          displayOrder: index,
        },
      });

    categories.push(created);
  }

  return categories;
}