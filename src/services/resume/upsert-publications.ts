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

export async function upsertPublications(
  portfolioId: string,
  resume: ParsedResume
) {
  if (!resume.publications.length) {
    return [];
  }

  const results = [];

  for (const [
    index,
    publication,
  ] of resume.publications.entries()) {
    const existing =
      await prisma.publication.findFirst({
        where: {
          portfolioId,
          title: publication.title,
        },
      });

    if (existing) {
      results.push(existing);
      continue;
    }

    const created =
      await prisma.publication.create({
        data: {
          portfolioId,
          title: publication.title,
          journal:
            publication.journal,
          publisher:
            publication.publisher,
          publicationDate:
            parseDate(
              publication.publicationDate
            ),
          doi: publication.doi,
          citations:
            publication.citations,
          abstract:
            publication.abstract,
          publicationUrl:
            publication.publicationUrl,
          pdfUrl:
            publication.pdfUrl,
          conference:
            publication.conference,
          authors:
            publication.authors ?? [],
          displayOrder: index,
        },
      });

    results.push(created);
  }

  return results;
}