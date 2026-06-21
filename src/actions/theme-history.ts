"use server";

import { prisma } from "@/lib/prisma";
import { ThemeType } from "@prisma/client";
import { getPortfolioId } from "@/lib/get-portfolio-id";

/**
 * Transforms theme history mutation exceptions, transaction failures, or datastore 
 * connection errors into structured, user-friendly responses tailored for UI toasts.
 */
function handleThemeServerError(error: any, fallbackMessage: string) {
  console.error("Theme Preference Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("portfolioId required") || errorMessage.includes("portfolioId not found")) {
    return {
      success: false,
      error: "Authentication mapping missing. Could not attach theme configuration metrics to a portfolio profile.",
    };
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return {
      success: false,
      error: "The custom aesthetic database engine is currently running log updates. Please try again.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function createThemeHistory(
  portfolioId: string,
  themeName: ThemeType
) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());
    
    if (!resolvedPortfolioId) {
      return { success: false, error: "Portfolio connection target not found. Unable to archive style modification metadata." };
    }

    if (!themeName) {
      return { success: false, error: "Theme scheme key selection structure must be specified." };
    }

    const result = await prisma.themeHistory.create({
      data: {
        portfolioId: resolvedPortfolioId,
        themeName,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleThemeServerError(error, "Failed to instantiate new visual skin alteration log context item.");
  }
}

export async function getThemeHistory(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());
    
    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Unable to find structural metadata parameters. Style configuration tracks lookup aborted.",
        data: [],
      };
    }

    const data = await prisma.themeHistory.findMany({
      where: { portfolioId: resolvedPortfolioId },
      orderBy: { changedAt: "desc" },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to query skin personalization chronological changes timeline maps:", error);
    return {
      success: false,
      error: "Failed to assemble the requested custom visual theme change history logs feed.",
      data: [],
    };
  }
}

export async function deleteThemeHistory(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Unique track parameters identification trace context key is empty. Deletion aborted." };
    }

    const result = await prisma.themeHistory.delete({
      where: { id },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleThemeServerError(error, "The specified skin configuration timeline record row could not be safely cleared.");
  }
}