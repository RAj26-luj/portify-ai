import {
  ProjectStatus,
  ProjectType,
} from "@prisma/client";

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

function parseProjectType(
  value?: string
): ProjectType | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  switch (normalized) {
    case "PERSONAL":
      return ProjectType.PERSONAL;

    case "ACADEMIC":
      return ProjectType.ACADEMIC;

    case "PROFESSIONAL":
      return ProjectType.PROFESSIONAL;

    case "RESEARCH":
      return ProjectType.RESEARCH;

    case "OPEN_SOURCE":
      return ProjectType.OPEN_SOURCE;

    default:
      return undefined;
  }
}

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

export async function upsertProjects(
  portfolioId: string,
  resume: ParsedResume
) {
  if (!resume.projects.length) {
    return [];
  }

  const results = [];

  for (const [
    index,
    project,
  ] of resume.projects.entries()) {
    const existing =
      await prisma.project.findFirst({
        where: {
          portfolioId,
          title: project.title,
        },
      });

    if (existing) {
      results.push(existing);
      continue;
    }

    const created =
      await prisma.project.create({
        data: {
          portfolioId,
          title: project.title,
          shortDescription:
            project.shortDescription,
          description:
            project.description,
          problemStatement:
            project.problemStatement,
          solution:
            project.solution,
          category:
            project.category,
          status:
            parseProjectStatus(
              project.status
            ),
          type: parseProjectType(
            project.type
          ),
          role: project.role,
          teamSize:
            project.teamSize,
          startDate: parseDate(
            project.startDate
          ),
          endDate: parseDate(
            project.endDate
          ),
          techStack:
            project.techStack ?? [],
          githubUrl:
            project.githubUrl,
          liveUrl:
            project.liveUrl,
          demoUrl:
            project.demoUrl,
          videoUrl:
            project.videoUrl,
          displayOrder: index,
        },
      });

    results.push(created);
  }

  return results;
}