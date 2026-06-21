import { prisma } from "@/lib/prisma";

export async function getProjectMetrics(
  projectId: string
) {
  return prisma.projectMetric.findMany({
    where: {
      projectId,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export async function getProjectMetric(
  metricId: string
) {
  return prisma.projectMetric.findUnique({
    where: {
      id: metricId,
    },
  });
}

export async function createProjectMetric(
  projectId: string,
  data: {
    label: string;
    value: string;
    description?: string;
    displayOrder?: number;
  }
) {
  const count =
    await prisma.projectMetric.count({
      where: {
        projectId,
      },
    });

  return prisma.projectMetric.create({
    data: {
      projectId,
      label: data.label,
      value: data.value,
      description:
        data.description,
      displayOrder:
        data.displayOrder ??
        count,
    },
  });
}

export async function updateProjectMetric(
  metricId: string,
  data: {
    label?: string;
    value?: string;
    description?: string;
    displayOrder?: number;
  }
) {
  return prisma.projectMetric.update({
    where: {
      id: metricId,
    },
    data,
  });
}

export async function deleteProjectMetric(
  metricId: string
) {
  return prisma.projectMetric.delete({
    where: {
      id: metricId,
    },
  });
}

export async function reorderProjectMetrics(
  projectId: string,
  metricIds: string[]
) {
  await prisma.$transaction(
    metricIds.map(
      (
        id,
        index
      ) =>
        prisma.projectMetric.update({
          where: {
            id,
            projectId,
          },
          data: {
            displayOrder:
              index,
          },
        })
    )
  );

  return {
    success: true,
  };
}