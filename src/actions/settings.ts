"use server";

import { prisma } from "@/lib/prisma";
import { getPortfolioId } from "@/lib/get-portfolio-id";

/**
 * Transforms system visibility modifications or internal datastore update failures
 * into uniform, consumer-friendly response payloads ideal for non-intrusive client UI flashes.
 */
function handleSettingsServerError(error: any, fallbackMessage: string) {
  console.error("Settings Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("portfolioId required") || errorMessage.includes("portfolioId not found")) {
    return {
      success: false,
      error: "Authentication reference token is missing. Could not modify portfolio publication status.",
    };
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return {
      success: false,
      error: "The deployment engine is temporarily busy running server synchronization. Please toggle status again.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function updatePortfolioVisibility(
  isPublic: boolean
) {
  try {
    const portfolioId = await getPortfolioId();

    if (!portfolioId) {
      return { 
        success: false, 
        error: "Active portfolio profile connection target not found. Visibility adjustments aborted." 
      };
    }

    const result = await prisma.portfolio.update({
      where: {
        id: portfolioId,
      },
      data: {
        isPublic,
        status: isPublic ? "PUBLISHED" : "DRAFT",
        publishedAt: isPublic ? new Date() : null,
      },
    });

    return { 
      success: true, 
      data: result 
    };
  } catch (error) {
    return handleSettingsServerError(error, "Failed to update public deployment configuration metrics.");
  }
}