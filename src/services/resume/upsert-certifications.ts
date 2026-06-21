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

export async function upsertCertifications(
  portfolioId: string,
  resume: ParsedResume
) {
  if (!resume.certifications.length) {
    return [];
  }

  const results = [];

  for (const [
    index,
    certification,
  ] of resume.certifications.entries()) {
    const existing =
      await prisma.certification.findFirst({
        where: {
          portfolioId,
          name: certification.name,
        },
      });

    if (existing) {
      results.push(existing);
      continue;
    }

    const created =
      await prisma.certification.create({
        data: {
          portfolioId,
          name: certification.name,
          issuer:
            certification.issuer,
          credentialId:
            certification.credentialId,
          issueDate: parseDate(
            certification.issueDate
          ),
          expiryDate: parseDate(
            certification.expiryDate
          ),
          credentialUrl:
            certification.credentialUrl,
          skillsCovered:
            certification.skillsCovered ??
            [],
          displayOrder: index,
        },
      });

    results.push(created);
  }

  return results;
}