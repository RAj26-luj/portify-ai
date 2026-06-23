"use server";

import { prisma } from "@/lib/prisma";
import { getPortfolioId } from "@/lib/get-portfolio-id";

// Error
function handleCodingProfileServerError(error: any, fallbackMessage: string) {
  console.error("Coding Profile Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("portfolioId required") ||
    errorMessage.includes("portfolioId not found")
  ) {
    return {
      success: false,
      error:
        "Authentication mapping missing. Could not tie this coding profile to an active portfolio account.",
    };
  }
  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return {
      success: false,
      error: "Algorithmic data synchronization failed. Database service is currently busy.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function createCodingProfile(data: {
  portfolioId: string;
  platform: string;
  username: string;
  profileUrl: string;
  iconName?: string;
  iconUrl?: string;
  iconSource?: "LIBRARY" | "USER_UPLOAD" | "DEFAULT_ICON";
  currentRating?: number;
  maxRating?: number;
  rank?: string;
  globalRank?: string;
  problemsSolved?: number;
  contestsAttended?: number;
  activeSince?: string;
  displayOrder?: number;
}) {
  try {
    const resolvedPortfolioId = data.portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Portfolio profile reference identification target not found.",
      };
    }

    if (!data.platform) {
      return {
        success: false,
        error: "Platform selection is required (e.g., CodeChef, LeetCode, Codeforces).",
      };
    }

    if (!data.username) {
      return {
        success: false,
        error: "Platform handle username metric is required to connect tracking details.",
      };
    }

    const count = await prisma.codingProfile.count({
      where: {
        portfolioId: resolvedPortfolioId,
      },
    });

    const result = await prisma.codingProfile.create({
      data: {
        portfolioId: resolvedPortfolioId,
        platform: data.platform,
        username: data.username,
        profileUrl: data.profileUrl,
        iconName: data.iconName,
        iconUrl: data.iconUrl,
        iconSource: data.iconSource,
        currentRating: data.currentRating,
        maxRating: data.maxRating,
        rank: data.rank,
        globalRank: data.globalRank,
        problemsSolved: data.problemsSolved,
        contestsAttended: data.contestsAttended,
        activeSince: data.activeSince,
        displayOrder: data.displayOrder ?? count,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleCodingProfileServerError(
      error,
      "Failed to instantiate competitive coding platform index profile."
    );
  }
}

export async function updateCodingProfile(
  id: string,
  data: {
    platform?: string;
    username?: string;
    profileUrl?: string;
    iconName?: string;
    iconUrl?: string;
    iconSource?: "LIBRARY" | "USER_UPLOAD" | "DEFAULT_ICON";
    currentRating?: number;
    maxRating?: number;
    rank?: string;
    globalRank?: string;
    problemsSolved?: number;
    contestsAttended?: number;
    activeSince?: string;
    displayOrder?: number;
  }
) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Missing coding profile item tracking identifier specification reference.",
      };
    }

    const result = await prisma.codingProfile.update({
      where: { id },
      data,
    });

    return { success: true, data: result };
  } catch (error) {
    return handleCodingProfileServerError(
      error,
      "Failed to modify statistical parameters inside this coding metrics record."
    );
  }
}

export async function deleteCodingProfile(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Identification key reference missing. Deletion sequence aborted.",
      };
    }

    const result = await prisma.codingProfile.delete({
      where: { id },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleCodingProfileServerError(
      error,
      "Could not completely delete the specified competitive profile matrix."
    );
  }
}

export async function getCodingProfiles(portfolioId?: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Unable to sync profile matrix records. No portfolio tracking identifier found.",
        data: [],
      };
    }

    const data = await prisma.codingProfile.findMany({
      where: {
        portfolioId: resolvedPortfolioId,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to compile coding profiles data streams feed:", error);
    return {
      success: false,
      error: "Failed to compile algorithmic stats registries overview.",
      data: [],
    };
  }
}

export async function getCodingProfileById(id: string) {
  try {
    if (!id) return { success: true, data: null };

    const data = await prisma.codingProfile.findUnique({
      where: { id },
    });

    return { success: true, data };
  } catch (error) {
    return handleCodingProfileServerError(
      error,
      "Failed to load individual technical profiling tracking log."
    );
  }
}

export async function reorderCodingProfiles(portfolioId: string, codingProfileIds: string[]) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Target portfolio connection reference identification was not resolved.",
      };
    }

    if (!codingProfileIds || codingProfileIds.length === 0) {
      return {
        success: true,
        message: "Empty sequencing order stack provided. Sequence unchanged.",
      };
    }

    await prisma.$transaction(
      codingProfileIds.map((id, index) =>
        prisma.codingProfile.update({
          where: { id },
          data: {
            displayOrder: index,
          },
        })
      )
    );

    return {
      success: true,
    };
  } catch (error) {
    return handleCodingProfileServerError(
      error,
      "Failed to persist chronological board sorting rules configuration."
    );
  }
}

export async function getTopCodingProfiles(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Unable to prioritize matrix list. Missing tracking identifier definition context.",
        data: [],
      };
    }

    const data = await prisma.codingProfile.findMany({
      where: {
        portfolioId: resolvedPortfolioId,
      },
      orderBy: [{ currentRating: "desc" }, { displayOrder: "asc" }],
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed executing priority rating sorting track calculations query:", error);
    return {
      success: false,
      error: "Could not filter priority leader indicators presentation lists.",
      data: [],
    };
  }
}
