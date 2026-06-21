"use server";

import {
  createAchievement as createAchievementService,
  updateAchievement as updateAchievementService,
  deleteAchievement as deleteAchievementService,
  getAchievements as getAchievementsService,
  getAchievementById as getAchievementByIdService,
} from "@/services/achievement";

/**
 * Custom uniform error signature returning customer-friendly strings
 * instead of letting infrastructure or database logs leak to the client.
 */
function handleServerError(error: any, fallbackMessage: string) {
  console.error("Server Action Exception caught:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("title is required")) {
    return { success: false, error: "Title is required. Please add an achievement title." };
  }
  if (errorMessage.includes("id is required")) {
    return { success: false, error: "Identifier is required to modify this record." };
  }
  if (errorMessage.includes("portfolioId not found")) {
    return { success: false, error: "Unable to find an active portfolio. Please check your session setup." };
  }
  if (errorMessage.includes("Network") || errorMessage.includes("fetch")) {
    return { success: false, error: "Network connection lost. Please verify your connection status." };
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return { success: false, error: "Database service failed to complete the request. Please try again." };
  }

  return { success: false, error: fallbackMessage };
}

export async function createAchievement(data: {
  portfolioId?: string; // keep for backward compatibility (DO NOT REMOVE)
  title: string;
  description?: string;
  issuer?: string;
  featured?: boolean;
  achievementDate?: Date;
  certificateUrl?: string;
  imageUrl?: string;
  rank?: string;
  position?: string;
  displayOrder?: number;
}) {
  try {
    if (!data.title) {
      return { success: false, error: "Title is required. Please fill in the achievement title." };
    }

    // fallback system (old frontend OR new system)
    let portfolioId = data.portfolioId;

    if (!portfolioId) {
      const { getPortfolioId } = await import("@/lib/get-portfolio-id");
      portfolioId = await getPortfolioId();
    }

    if (!portfolioId) {
      return { success: false, error: "Portfolio connection target not found. Unable to link achievement." };
    }

    const result = await createAchievementService({
      ...data,
      portfolioId,
    });

    return { success: true, data: result };
  } catch (error) {
    return handleServerError(error, "Unable to create achievement. Please review details and try again.");
  }
}

export async function updateAchievement(
  id: string,
  data: {
    title?: string;
    description?: string;
    issuer?: string;
    featured?: boolean;
    achievementDate?: Date;
    certificateUrl?: string;
    imageUrl?: string;
    rank?: string;
    position?: string;
    displayOrder?: number;
  }
) {
  try {
    if (!id) {
      return { success: false, error: "Missing achievement record reference identity." };
    }

    const result = await updateAchievementService(id, data);
    return { success: true, data: result };
  } catch (error) {
    return handleServerError(error, "Unable to save changes to this achievement. Please try again.");
  }
}

export async function deleteAchievement(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Achievement identification missing. Delete request cancelled." };
    }

    const result = await deleteAchievementService(id);
    return { success: true, data: result };
  } catch (error) {
    return handleServerError(error, "Removal failed. This achievement could not be deleted.");
  }
}

export async function getAchievements(portfolioId: string) {
  try {
    // fallback: auto-resolve if not provided
    let targetPortfolioId = portfolioId;
    if (!targetPortfolioId) {
      const { getPortfolioId } = await import("@/lib/get-portfolio-id");
      targetPortfolioId = await getPortfolioId();
    }

    if (!targetPortfolioId) {
      return { success: false, error: "Unable to retrieve records. Portfolio profile not found." };
    }

    const data = await getAchievementsService(targetPortfolioId);
    return { success: true, data };
  } catch (error) {
    return handleServerError(error, "Unable to load achievements feed. Please refresh your page.");
  }
}

export async function getAchievementById(id: string) {
  try {
    if (!id) return { success: true, data: null };

    const data = await getAchievementByIdService(id);
    return { success: true, data };
  } catch (error) {
    return handleServerError(error, "Unable to fetch requested achievement information details.");
  }
}