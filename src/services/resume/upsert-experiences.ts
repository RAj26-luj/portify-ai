import { EmploymentType } from "@prisma/client";

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

function parseEmploymentType(
  value?: string
): EmploymentType | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  switch (normalized) {
    case "FULL_TIME":
      return EmploymentType.FULL_TIME;

    case "PART_TIME":
      return EmploymentType.PART_TIME;

    case "INTERNSHIP":
      return EmploymentType.INTERNSHIP;

    case "FREELANCE":
      return EmploymentType.FREELANCE;

    case "CONTRACT":
      return EmploymentType.CONTRACT;

    default:
      return undefined;
  }
}

export async function upsertExperiences(
  portfolioId: string,
  resume: ParsedResume
) {
  if (!resume.experience.length) {
    return [];
  }

  const results = [];

  for (const [
    index,
    experience,
  ] of resume.experience.entries()) {
    const existing =
      await prisma.experience.findFirst({
        where: {
          portfolioId,
          company: experience.company,
          position: experience.position,
        },
      });

    if (existing) {
      results.push(existing);
      continue;
    }

    const created =
      await prisma.experience.create({
        data: {
          portfolioId,
          company: experience.company,
          position: experience.position,
          employmentType:
            parseEmploymentType(
              experience.employmentType
            ),
          location:
            experience.location,
          companyWebsite:
            experience.companyWebsite,
          startDate: parseDate(
            experience.startDate
          ),
          endDate: parseDate(
            experience.endDate
          ),
          currentlyWorking:
            experience.currentlyWorking ??
            false,
          description:
            experience.description,
          responsibilities:
            experience.responsibilities ?? [],
          technologies:
            experience.technologies ?? [],
          displayOrder: index,
        },
      });

    results.push(created);
  }

  return results;
}