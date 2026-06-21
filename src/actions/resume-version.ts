"use server";

import { prisma } from "@/lib/prisma";
import { getPortfolioId } from "@/lib/get-portfolio-id";

/**
 * Transforms system exceptions or database timeouts into clean, human-readable
 * response objects tailored for seamless client-side UI flash alerts.
 */
function handleResumeVersionServerError(error: any, fallbackMessage: string) {
  console.error("Resume Version Core Service Server Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("Portfolio not found")) {
    return {
      success: false,
      error: "Authentication reference token is missing. Could not locate a valid portfolio account.",
    };
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return {
      success: false,
      error: "The versioning registry is temporarily busy running background optimizations. Please try again.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function getResumeVersions(
  portfolioId?: string
) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Unable to sync version history. No matching portfolio context tracker was located.",
        data: [],
      };
    }

    const data = await prisma.resumeVersion.findMany({
      where: {
        portfolioId: resolvedPortfolioId,
      },
      orderBy: {
        uploadedAt: "desc",
      },
      include: {
        changeLogs: true,
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to query chronological resume snapshots ledger track:", error);
    return {
      success: false,
      error: "Failed to assemble the historic document version history control tree.",
      data: [],
    };
  }
}

export async function getResumeVersion(
  id: string
) {
  try {
    if (!id) {
      return { success: false, error: "Unique file asset identifier code parameter is missing from lookup targets.", data: null };
    }

    const data = await prisma.resumeVersion.findUnique({
      where: {
        id,
      },
      include: {
        changeLogs: true,
      },
    });

    return { success: true, data };
  } catch (error) {
    return handleResumeVersionServerError(error, "Failed to load detailed profile parameters for this individual snapshot.");
  }
}

export async function deleteResumeVersion(
  id: string
) {
  try {
    if (!id) {
      return { success: false, error: "Missing version reference pointer trace key. Wiping pipeline cancelled." };
    }

    await prisma.resumeVersion.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    return handleResumeVersionServerError(error, "The selected historical document copy could not be cleared from the system.");
  }
}