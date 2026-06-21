"use server";

import { prisma } from "@/lib/prisma";
import {
  ProjectStatus,
  ProjectType,
} from "@prisma/client";
import { getPortfolioId } from "@/lib/get-portfolio-id";

/**
 * Transforms software project management datastore anomalies or internal query exceptions
 * into standardized, client-friendly signatures optimized for sleek UI flash alerts.
 */
function handleProjectServerError(error: any, fallbackMessage: string) {
  console.error("Project Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("portfolioId required") || errorMessage.includes("portfolioId not found")) {
    return {
      success: false,
      error: "Authentication reference token is missing. Could not link project assets to a portfolio profile.",
    };
  }
  if (errorMessage.includes("Project not found")) {
    return {
      success: false,
      error: "The requested engineering case study record could not be found.",
    };
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return {
      success: false,
      error: "Project showcase datastore is carrying out system operations. Please re-submit changes.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function createProject(data: {
  portfolioId: string;

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

  techStack?: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  demoUrl?: string | null;
  videoUrl?: string | null;

  images?: string[];

  featured?: boolean;
  displayOrder?: number;
}) {
  try {
    const resolvedPortfolioId = data.portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return { success: false, error: "Portfolio specification profile identification target not found." };
    }

    if (!data.title) {
      return { success: false, error: "Project engineering title or application label name parameter is required." };
    }

    const result = await prisma.project.create({
      data: {
        portfolioId: resolvedPortfolioId,

        title: data.title,

        shortDescription: data.shortDescription,
        description: data.description,
        problemStatement: data.problemStatement,
        solution: data.solution,
        category: data.category,

        status: data.status,

        type: data.type ?? ProjectType.PERSONAL,

        role: data.role,
        teamSize: data.teamSize,

        projectBanner: data.projectBanner,
        coverImage: data.coverImage,
        thumbnail: data.thumbnail,

        startDate: data.startDate,
        endDate: data.endDate,

        techStack: data.techStack ?? [],

        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        demoUrl: data.demoUrl,
        videoUrl: data.videoUrl,

        images: data.images ?? [],

        featured: data.featured ?? false,
        displayOrder: data.displayOrder ?? 0,
      },
      include: {
        metrics: true,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleProjectServerError(error, "Failed to instantiate new project showcase registry details entry.");
  }
}

export async function updateProject(
  id: string,
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

    techStack?: string[];

    githubUrl?: string | null;
    liveUrl?: string | null;
    demoUrl?: string | null;
    videoUrl?: string | null;

    images?: string[];

    featured?: boolean;
    displayOrder?: number;
  }
) {
  try {
    if (!id) {
      return { success: false, error: "Missing distinct architectural tracking index key parameter reference." };
    }

    const result = await prisma.project.update({
      where: { id },
      data,
      include: { metrics: true },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleProjectServerError(error, "Failed to apply project specification changes onto data store layers.");
  }
}

export async function getProjects(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Unable to sync project cards. Target portfolio tracking context was not verified.",
        data: [],
      };
    }

    const data = await prisma.project.findMany({
      where: {
        portfolioId: resolvedPortfolioId,
      },
      include: {
        metrics: {
          orderBy: { displayOrder: "asc" },
        },
        projectClicks: true,
      },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to query case study project catalog registry feed:", error);
    return {
      success: false,
      error: "Failed to compile project showcase grid display view dashboards.",
      data: [],
    };
  }
}

export async function getProjectById(id: string) {
  try {
    if (!id || id.trim() === "") {
      return { success: true, data: null };
    }

    const data = await prisma.project.findUnique({
      where: { id },
      include: {
        metrics: {
          orderBy: { displayOrder: "asc" },
        },
        projectClicks: true,
      },
    });

    return { success: true, data };
  } catch (error) {
    return handleProjectServerError(error, "Failed to cross-reference system details parameters for this project case study.");
  }
}

export async function deleteProject(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Project tracking trace parameter identification string missing. Deletion sequence aborted." };
    }

    const result = await prisma.project.delete({
      where: { id },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleProjectServerError(error, "The specified work portfolio showcase project module could not be successfully cleared.");
  }
}

export async function toggleFeaturedProject(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Target parameter asset identifier missing." };
    }

    const project = await prisma.project.findUnique({
      where: { id },
      select: { featured: true },
    });

    if (!project) {
      return { success: false, error: "Highlight priority settings failed: Matching project profile entry not found." };
    }

    const result = await prisma.project.update({
      where: { id },
      data: { featured: !project.featured },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleProjectServerError(error, "Unable to adjust highlight selection configuration criteria display rules.");
  }
}

export async function reorderProjects(
  portfolioId: string,
  projectIds: string[]
) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return { success: false, error: "Target portfolio reference identity validation marker code not resolved." };
    }

    if (!projectIds || projectIds.length === 0) {
      return { success: true, message: "Empty sequencing configuration layout rules provided. Sequence grid unchanged." };
    }

    await prisma.$transaction(
      projectIds.map((projectId, index) =>
        prisma.project.update({
          where: {
            id: projectId,
            portfolioId: resolvedPortfolioId,
          },
          data: {
            displayOrder: index,
          },
        })
      )
    );

    return { success: true };
  } catch (error) {
    return handleProjectServerError(error, "Failed to commit customized project timeline grid board sorting reorders.");
  }
}

export async function createProjectMetric(data: {
  projectId: string;
  label: string;
  value: string;
  description?: string | null;
  displayOrder?: number;
}) {
  try {
    if (!data.projectId) {
      return { success: false, error: "Parent case study context identifier mapping is missing." };
    }

    if (!data.label) {
      return { success: false, error: "Analytical summary parameter label parameter criteria is required." };
    }

    if (!data.value) {
      return { success: false, error: "Analytical outcome metric value indicator text is required." };
    }

    const result = await prisma.projectMetric.create({
      data: {
        projectId: data.projectId,
        label: data.label,
        value: data.value,
        description: data.description,
        displayOrder: data.displayOrder ?? 0,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleProjectServerError(error, "Failed to append inline project highlight analytics row indices.");
  }
}

export async function updateProjectMetric(
  id: string,
  data: {
    label?: string;
    value?: string;
    description?: string | null;
    displayOrder?: number;
  }
) {
  try {
    if (!id) {
      return { success: false, error: "Missing unique statistical highlight index mapping key tracer reference." };
    }

    const result = await prisma.projectMetric.update({
      where: { id },
      data,
    });

    return { success: true, data: result };
  } catch (error) {
    return handleProjectServerError(error, "Failed to adjust properties fields inside this project metrics module.");
  }
}

export async function deleteProjectMetric(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Identification trace tracking token parameter string missing. Deletion sequence aborted." };
    }

    const result = await prisma.projectMetric.delete({
      where: { id },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleProjectServerError(error, "The specified standalone metric grid parameter metadata field row could not be cleared.");
  }
}

export async function getProjectMetrics(projectId: string) {
  try {
    if (!projectId) {
      return {
        success: false,
        error: "Project specification parameters argument missing.",
        data: [],
      };
    }

    const data = await prisma.projectMetric.findMany({
      where: { projectId },
      orderBy: { displayOrder: "asc" },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed compiling individual data analytics indicators charts summary rows:", error);
    return {
      success: false,
      error: "Failed to assemble individual case study key quantitative data index records.",
      data: [],
    };
  }
}