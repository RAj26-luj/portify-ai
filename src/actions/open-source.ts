"use server";

import {
  createOpenSourceProject as createOpenSourceProjectService,
  updateOpenSourceProject as updateOpenSourceProjectService,
  getOpenSourceProjects as getOpenSourceProjectsService,
  getOpenSourceProject as getOpenSourceProjectService,
  deleteOpenSourceProject as deleteOpenSourceProjectService,
} from "@/services/open-source";

import { getPortfolioId } from "@/lib/get-portfolio-id";

// Error
function handleOpenSourceServerError(error: any, fallbackMessage: string) {
  console.error("Open Source Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("portfolioId required") ||
    errorMessage.includes("portfolioId not found")
  ) {
    return {
      success: false,
      error:
        "Authentication reference token is missing. Could not link open-source contributions to an active portfolio.",
    };
  }
  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return {
      success: false,
      error:
        "Contribution ledger storage engine is carrying out schema configurations. Please try again shortly.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function createOpenSourceProject(data: {
  portfolioId: string;
  repositoryName: string;
  repositoryUrl?: string;
  pullRequestUrl?: string;
  pullRequestTitle?: string;
  issueTitle?: string;
  contributionType?: string;
  description?: string;
  impactMetrics?: string[];
  linesChanged?: string;
  status?: "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "MAINTAINED";
  coverImage?: string;
  architectureDiagrams?: string[];
  contributionScreenshots?: string[];
  displayOrder?: number;
  contributionTitle?: string;
}) {
  try {
    const resolvedPortfolioId = data.portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Portfolio connection target not found. Unable to create open source milestone.",
      };
    }

    if (!data.repositoryName) {
      return {
        success: false,
        error: "Repository name field parameter is required to identify the codebase contribution.",
      };
    }

    const result = await createOpenSourceProjectService(resolvedPortfolioId, {
      repositoryName: data.repositoryName,
      repositoryUrl: data.repositoryUrl,
      pullRequestUrl: data.pullRequestUrl,
      pullRequestTitle: data.pullRequestTitle,
      issueTitle: data.issueTitle,
      contributionType: data.contributionType,
      description: data.description,
      impactMetrics: data.impactMetrics,
      linesChanged: data.linesChanged,
      status: data.status,
      coverImage: data.coverImage,
      architectureDiagrams: data.architectureDiagrams,
      contributionScreenshots: data.contributionScreenshots,
      displayOrder: data.displayOrder,
      contributionTitle: data.contributionTitle,
    });

    return { success: true, data: result };
  } catch (error) {
    return handleOpenSourceServerError(
      error,
      "Failed to instantiate new open source contribution record details."
    );
  }
}

export async function updateOpenSourceProject(
  id: string,
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
    status?: "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "MAINTAINED";
    coverImage?: string;
    architectureDiagrams?: string[];
    contributionScreenshots?: string[];
    displayOrder?: number;
    contributionTitle?: string;
  }
) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Missing unique structural identification mapping reference string key.",
      };
    }

    const result = await updateOpenSourceProjectService(id, data);
    return { success: true, data: result };
  } catch (error) {
    return handleOpenSourceServerError(
      error,
      "Failed to apply contribution history modifications back into database store."
    );
  }
}

export async function getOpenSourceProjects(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error:
          "Unable to retrieve records. Target portfolio profile identity parameters cannot be mapped.",
        data: [],
      };
    }

    const data = await getOpenSourceProjectsService(resolvedPortfolioId);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to compile open source development timeline grid lists:", error);
    return {
      success: false,
      error: "Failed to load open-source contributions ledger track view feeds dashboard.",
      data: [],
    };
  }
}

export async function getOpenSourceProjectById(id: string) {
  try {
    if (!id) return { success: true, data: null };

    const data = await getOpenSourceProjectService(id);
    return { success: true, data };
  } catch (error) {
    return handleOpenSourceServerError(
      error,
      "Failed to track specific open-source profiling metric record lines."
    );
  }
}

export async function deleteOpenSourceProject(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error:
          "Missing contribution track reference trace key pointer. Removal pipeline cancelled.",
      };
    }

    const result = await deleteOpenSourceProjectService(id);
    return { success: true, data: result };
  } catch (error) {
    return handleOpenSourceServerError(
      error,
      "The specified open source history registry index could not be cleared."
    );
  }
}
