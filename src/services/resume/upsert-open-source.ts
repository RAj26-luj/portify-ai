import {
  ProjectStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

import type { ParsedResume } from "@/types/parsed-resume";

function parseProjectStatus(
  value?: string
): ProjectStatus | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  switch (normalized) {
    case "PLANNING":
      return ProjectStatus.PLANNING;

    case "IN_PROGRESS":
      return ProjectStatus.IN_PROGRESS;

    case "COMPLETED":
      return ProjectStatus.COMPLETED;

    case "MAINTAINED":
      return ProjectStatus.MAINTAINED;

    default:
      return undefined;
  }
}

export async function upsertOpenSource(
  portfolioId: string,
  resume: ParsedResume
) {
  if (!resume.openSource.length) {
    return [];
  }

  const results = [];

  for (const [
    index,
    project,
  ] of resume.openSource.entries()) {
    const existing =
      await prisma.openSourceProject.findFirst({
        where: {
          portfolioId,
          repositoryName:
            project.repositoryName,
        },
      });

    if (existing) {
      results.push(existing);
      continue;
    }

    const created =
      await prisma.openSourceProject.create({
        data: {
          portfolioId,
          repositoryName:
            project.repositoryName,
          repositoryUrl:
            project.repositoryUrl,
          pullRequestUrl:
            project.pullRequestUrl,
          pullRequestTitle:
            project.pullRequestTitle,
          issueTitle:
            project.issueTitle,
          contributionType:
            project.contributionType,
          description:
            project.description,
          impactMetrics:
            project.impactMetrics ?? [],
          linesChanged:
            project.linesChanged,
          contributionTitle:
            project.contributionTitle,
          status: parseProjectStatus(
            (project as { status?: string })
              .status
          ),
          displayOrder: index,
        },
      });

    results.push(created);
  }

  return results;
}