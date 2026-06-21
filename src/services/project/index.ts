import { prisma } from "@/lib/prisma";
import {
  ProjectStatus,
  ProjectType,
} from "@prisma/client";

export async function getProjects(portfolioId: string) {
  if (!portfolioId || portfolioId.trim() === "") {
    return [];
  }

  return prisma.project.findMany({
    where: {
      portfolioId,
    },
    include: {
      metrics: {
        orderBy: {
          displayOrder: "asc",
        },
      },
      projectClicks: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export async function getProject(projectId: string) {
  if (!projectId || projectId.trim() === "") {
    return null;
  }

  return prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      metrics: {
        orderBy: {
          displayOrder: "asc",
        },
      },
      projectClicks: true,
    },
  });
}

export async function createProject(
  portfolioId: string,
  data: {
    title: string;
    shortDescription?: string | null;
    description?: string | null;
    problemStatement?: string | null;
    solution?: string | null;
    category?: string | null;

    status?: ProjectStatus | null;
    type?: ProjectType | null;

    role?: string | null;
    teamSize?: number | null;

    projectBanner?: string | null;
    coverImage?: string | null;
    thumbnail?: string | null;

    startDate?: Date | null;
    endDate?: Date | null;

    githubUrl?: string | null;
    liveUrl?: string | null;
    demoUrl?: string | null;
    videoUrl?: string | null;

    techStack?: string[];
    images?: string[];

    featured?: boolean;
  }
) {
  const count =
    await prisma.project.count({
      where: {
        portfolioId,
      },
    });

  return prisma.project.create({
    data: {
      portfolioId,

      title: data.title,
      shortDescription:
        data.shortDescription,
      description:
        data.description,
      problemStatement:
        data.problemStatement,
      solution:
        data.solution,
      category:
        data.category,

      status:
        data.status,
      type:
        data.type,

      role:
        data.role,
      teamSize:
        data.teamSize,

      projectBanner:
        data.projectBanner,
      coverImage:
        data.coverImage,
      thumbnail:
        data.thumbnail,

      startDate:
        data.startDate,
      endDate:
        data.endDate,

      githubUrl:
        data.githubUrl,
      liveUrl:
        data.liveUrl,
      demoUrl:
        data.demoUrl,
      videoUrl:
        data.videoUrl,

      techStack:
        data.techStack ?? [],
      images:
        data.images ?? [],

      featured:
        data.featured ?? false,

      displayOrder:
        count,
    },
    include: {
      metrics: true,
    },
  });
}

export async function updateProject(
  projectId: string,
  data: {
    title?: string;

    shortDescription?: string | null;
    description?: string | null;
    problemStatement?: string | null;
    solution?: string | null;
    category?: string | null;

    status?: ProjectStatus | null;
    type?: ProjectType | null;

    role?: string | null;
    teamSize?: number | null;

    projectBanner?: string | null;
    coverImage?: string | null;
    thumbnail?: string | null;

    startDate?: Date | null;
    endDate?: Date | null;

    githubUrl?: string | null;
    liveUrl?: string | null;
    demoUrl?: string | null;
    videoUrl?: string | null;

    techStack?: string[];
    images?: string[];

    featured?: boolean;
    displayOrder?: number;
  }
) {
  return prisma.project.update({
    where: {
      id: projectId,
    },
    data,
    include: {
      metrics: true,
    },
  });
}

export async function deleteProject(
  projectId: string
) {
  return prisma.project.delete({
    where: {
      id: projectId,
    },
  });
}

export async function reorderProjects(
  portfolioId: string,
  projectIds: string[]
) {
  await prisma.$transaction(
    projectIds.map(
      (
        id,
        index
      ) =>
        prisma.project.update({
          where: {
            id,
            portfolioId,
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

export async function toggleFeaturedProject(
  projectId: string
) {
  const project =
    await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        featured: true,
      },
    });

  if (!project) {
    throw new Error(
      "Project not found"
    );
  }

  return prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      featured:
        !project.featured,
    },
  });
}

export async function getFeaturedProjects(
  portfolioId: string
) {
  return prisma.project.findMany({
    where: {
      portfolioId,
      featured: true,
    },
    include: {
      metrics: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

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
    description?: string | null;
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
      label:
        data.label,
      value:
        data.value,
      description:
        data.description,
      displayOrder:
        count,
    },
  });
}

export async function updateProjectMetric(
  metricId: string,
  data: {
    label?: string;
    value?: string;
    description?: string | null;
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