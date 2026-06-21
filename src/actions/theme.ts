"use server";

import {
  activateTheme as activateThemeService,
  getThemes as getThemesService,
  getPortfolioTheme as getPortfolioThemeService,
  updateThemeConfig as updateThemeConfigService,
  getThemeHistory as getThemeHistoryService,
} from "@/services/theme";
import { ThemeType } from "@prisma/client";
import { getPortfolioId } from "@/lib/get-portfolio-id";

/**
 * Transforms interface theme mutations, structural skin overrides, or core database
 * tracking failures into standardized, user-friendly responses tailored for UI toasts.
 */
function handleThemeConfigServerError(error: any, fallbackMessage: string) {
  console.error("Theme Controller Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("portfolioId required") || errorMessage.includes("portfolioId not found")) {
    return {
      success: false,
      error: "Authentication mapping missing. Could not link visual profile skins to an active portfolio account.",
    };
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return {
      success: false,
      error: "The layout personalization engine is currently running data sync updates. Please switch styles again.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function activateTheme(
  portfolioId: string,
  themeName: ThemeType
) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());
    
    if (!resolvedPortfolioId) {
      return { success: false, error: "Portfolio specification profile identification target not found." };
    }

    if (!themeName) {
      return { success: false, error: "A valid theme variant classifier string parameter must be specified." };
    }

    const result = await activateThemeService(resolvedPortfolioId, themeName);
    return { success: true, data: result };
  } catch (error) {
    return handleThemeConfigServerError(error, "Failed to apply and deploy requested layout skin configurations.");
  }
}

export async function getActiveTheme(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());
    
    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Unable to identify active style attributes. Target tracking identifier context is unverified.",
        data: null,
      };
    }

    const data = await getPortfolioThemeService(resolvedPortfolioId);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to query runtime UI skin styling parameters:", error);
    return {
      success: false,
      error: "Failed to load individual presentation style components tracks.",
      data: null,
    };
  }
}

export async function getThemes() {
  try {
    const data = await getThemesService();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to retrieve aesthetic catalog preset lists matrix:", error);
    return {
      success: false,
      error: "Could not compile system design system themes listings dashboard.",
      data: [],
    };
  }
}

export async function updateThemeConfig(
  portfolioId: string,
  config: any
) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());
    
    if (!resolvedPortfolioId) {
      return { success: false, error: "Missing operational metadata tracking parameters to write configuration blocks." };
    }

    if (!config) {
      return { success: false, error: "Aesthetic properties configuration data modifications payload maps cannot be empty." };
    }

    const result = await updateThemeConfigService(resolvedPortfolioId, config);
    return { success: true, data: result };
  } catch (error) {
    return handleThemeConfigServerError(error, "Failed to write updated token properties changes back into layout settings.");
  }
}

export async function getThemeHistory(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());
    
    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Unable to map historical variations tracks. Portfolio identifier context missing.",
        data: [],
      };
    }

    const data = await getThemeHistoryService(resolvedPortfolioId);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to query historical interface appearance tracks:", error);
    return {
      success: false,
      error: "Failed to assemble the historic skin personalization log list stream elements.",
      data: [],
    };
  }
}