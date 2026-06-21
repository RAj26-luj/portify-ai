import { prisma } from "@/lib/prisma";

import type { ParsedResume } from "@/types/parsed-resume";

export async function upsertCustomSections(
  portfolioId: string,
  resume: ParsedResume
) {
  if (
    !resume.customSections ||
    !resume.customSections.length
  ) {
    return [];
  }

  const results = [];

  for (const [
    index,
    section,
  ] of resume.customSections.entries()) {
    const existing =
      await prisma.customSection.findFirst({
        where: {
          portfolioId,
          title: section.title,
        },
      });

    if (existing) {
      results.push(existing);
      continue;
    }

    const created =
      await prisma.customSection.create({
        data: {
          portfolioId,
          title: section.title,
          subtitle:
            section.subtitle,
          description:
            section.description,
          richTextContent:
            section.content,
          displayOrder: index,
          isVisible: true,
        },
      });

    results.push(created);
  }

  return results;
}