import { prisma } from "@/lib/prisma";

export async function getOpenSourceProjects(
  portfolioId: string
) {
  return prisma.openSourceProject.findMany({
    where: {
      portfolioId,
    },
    include: {
      timeline: {
        orderBy: {
          displayOrder:
            "asc",
        },
      },
    },
    orderBy: {
      displayOrder:
        "asc",
    },
  });
}

export async function getOpenSourceProject(
  openSourceId: string
) {
  return prisma.openSourceProject.findUnique({
    where: {
      id: openSourceId,
    },
    include: {
      timeline: {
        orderBy: {
          displayOrder:
            "asc",
        },
      },
    },
  });
}

export async function createOpenSourceProject(
  portfolioId: string,
  data: {
    repositoryName: string;
    repositoryUrl?: string;
    pullRequestUrl?: string;
    pullRequestTitle?: string;
    issueTitle?: string;
    contributionType?: string;
    description?: string;
    impactMetrics?: string[];
    linesChanged?: string;
    contributionTitle?: string;
    coverImage?: string;
    architectureDiagrams?: string[];
    contributionScreenshots?: string[];
    status?:
      | "PLANNING"
      | "IN_PROGRESS"
      | "COMPLETED"
      | "MAINTAINED";
    displayOrder?: number;

    timeline?: {
      milestone: string;
      progress: number;
      description?: string;
    }[];
  }
) {
  const count = await prisma.openSourceProject.count({
    where: {
      portfolioId,
    },
  });

  const { timeline = [], ...projectData } = data;

  return prisma.openSourceProject.create({
    data: {
      portfolioId,

      repositoryName: projectData.repositoryName,
      repositoryUrl: projectData.repositoryUrl,
      pullRequestUrl: projectData.pullRequestUrl,
      pullRequestTitle: projectData.pullRequestTitle,
      issueTitle: projectData.issueTitle,
      contributionType: projectData.contributionType,
      description: projectData.description,
      impactMetrics: projectData.impactMetrics ?? [],
      linesChanged: projectData.linesChanged,
      contributionTitle: projectData.contributionTitle,
      coverImage: projectData.coverImage,
      architectureDiagrams:
        projectData.architectureDiagrams ?? [],
      contributionScreenshots:
        projectData.contributionScreenshots ?? [],
      status: projectData.status,
      displayOrder:
        projectData.displayOrder ?? count,

      timeline: {
        create: timeline.map((item) => ({
          milestone: item.milestone,
          progress: Number(item.progress),
          description: item.description || null,
        })),
      },
    },

    include: {
      timeline: true,
    },
  });
}
export async function updateOpenSourceProject(
  openSourceId: string,
  data: {
    repositoryName?: string;
    repositoryUrl?: string;
    pullRequestUrl?: string;
    pullRequestTitle?: string;
    issueTitle?: string;
    contributionType?: string;
    description?: string;
    impactMetrics?: string[];
    linesChanged?: string;
    contributionTitle?: string;
    coverImage?: string;
    architectureDiagrams?: string[];
    contributionScreenshots?: string[];
    status?:
      | "PLANNING"
      | "IN_PROGRESS"
      | "COMPLETED"
      | "MAINTAINED";
    displayOrder?: number;

    timeline?: {
      id?: string;
      milestone: string;
      progress: number;
      description?: string;
    }[];
  }
) {
  const { timeline = [], ...projectData } = data;

  return prisma.openSourceProject.update({
    where: {
      id: openSourceId,
    },
    data: {
      ...projectData,

      timeline: {
        deleteMany: {},

        create: timeline.map((item) => ({
          milestone: item.milestone,
          progress: Number(item.progress),
          description: item.description || null,
        })),
      },
    },

    include: {
      timeline: true,
    },
  });
}

export async function deleteOpenSourceProject(
  openSourceId: string
) {
  return prisma.openSourceProject.delete({
    where: {
      id: openSourceId,
    },
  });
}

export async function reorderOpenSourceProjects(
  portfolioId: string,
  openSourceIds: string[]
) {
  await prisma.$transaction(
    openSourceIds.map(
      (
        id,
        index
      ) =>
        prisma.openSourceProject.update({
          where: {
            id,
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

export async function addTimelineEntry(
  openSourceId: string,
  data: {
    milestone: string;
    progress: number;
    description?: string;
    displayOrder?: number;
  }
) {
  const count =
    await prisma.openSourceTimeline.count({
      where: {
        openSourceId,
      },
    });

  return prisma.openSourceTimeline.create({
    data: {
      openSourceId,
      milestone:
        data.milestone,
      progress:
        data.progress,
      description:
        data.description,
      displayOrder:
        data.displayOrder ??
        count,
    },
  });
}

export async function updateTimelineEntry(
  timelineId: string,
  data: {
    milestone?: string;
    progress?: number;
    description?: string;
    displayOrder?: number;
  }
) {
  return prisma.openSourceTimeline.update({
    where: {
      id: timelineId,
    },
    data,
  });
}

export async function deleteTimelineEntry(
  timelineId: string
) {
  return prisma.openSourceTimeline.delete({
    where: {
      id: timelineId,
    },
  });
}