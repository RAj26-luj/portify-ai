import { prisma } from "@/lib/prisma";

import type { ParsedResume } from "@/types/parsed-resume";

export async function upsertProjectMetrics(
  portfolioId: string,
  resume: ParsedResume
) {
  if (!resume.projects.length) {
    return;
  }

  for (const project of resume.projects) {
    if (
      !project.metrics ||
      !project.metrics.length
    ) {
      continue;
    }

    const dbProject =
      await prisma.project.findFirst({
        where: {
          portfolioId,
          title: project.title,
        },
        select: {
          id: true,
        },
      });

    if (!dbProject) {
      continue;
    }

    for (const [
      index,
      metric,
    ] of project.metrics.entries()) {
      const existing =
        await prisma.projectMetric.findFirst({
          where: {
            projectId: dbProject.id,
            label: metric.label,
          },
        });

      if (existing) {
        continue;
      }

      await prisma.projectMetric.create({
        data: {
          projectId: dbProject.id,
          label: metric.label,
          value: metric.value,
          description:
            metric.description,
          displayOrder: index,
        },
      });
    }
  }
}