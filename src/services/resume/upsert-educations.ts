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

export async function upsertEducations(
  portfolioId: string,
  resume: ParsedResume
) {
  await prisma.education.deleteMany({
    where: {
      portfolioId,
    },
  });

  if (!resume.education.length) {
    return [];
  }

  const results = [];

  for (const [
    index,
    education,
  ] of resume.education.entries()) {
    const created =
      await prisma.education.create({
        data: {
          portfolioId,

          institution:
            education.institution,

          degree:
            education.degree,

          fieldOfStudy:
            education.fieldOfStudy,

          grade:
            education.grade,

          cgpa:
            education.cgpa,

          location:
            education.location,

          startDate: parseDate(
            education.startDate
          ),

          endDate: parseDate(
            education.endDate
          ),

          currentlyStudying:
            education.currentlyStudying ??
            false,

          description:
            education.description,

          displayOrder:
            index,
        },
      });

    results.push(created);
  }

  return results;
}