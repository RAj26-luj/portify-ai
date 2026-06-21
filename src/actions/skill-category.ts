"use server";

import {
  createSkillCategory as createSkillCategoryService,
  getSkillCategories as getSkillCategoriesService,
  getSkillCategory as getSkillCategoryService,
  updateSkillCategory as updateSkillCategoryService,
  deleteSkillCategory as deleteSkillCategoryService,
  reorderSkillCategories as reorderSkillCategoriesService,
} from "@/services/skill-category";
import { getPortfolioId } from "@/lib/get-portfolio-id";

/**
 * Transforms system validation errors, classification anomalies, or datastore lookup
 * faults into structured, user-friendly responses optimized for instant UI alerts.
 */
function handleSkillCategoryServerError(error: any, fallbackMessage: string) {
  console.error("Skill Category Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("portfolioId required") || errorMessage.includes("portfolioId not found")) {
    return {
      success: false,
      error: "Authentication mapping missing. Could not link this skill category to an active portfolio profile.",
    };
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return {
      success: false,
      error: "The taxonomy management engine is temporarily performing database updates. Please try again.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function createSkillCategory(
  portfolioId: string,
  data: {
    name: string;
    displayOrder?: number;
  }
) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());
    
    if (!resolvedPortfolioId) {
      return { success: false, error: "Portfolio connection target not found. Unable to create classification group." };
    }

    if (!data.name) {
      return { success: false, error: "Skill category label or classification group name parameter cannot be left blank." };
    }

    const result = await createSkillCategoryService(resolvedPortfolioId, data);
    return { success: true, data: result };
  } catch (error) {
    return handleSkillCategoryServerError(error, "Failed to instantiate new skill categorization grid container.");
  }
}

export async function getSkillCategories(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());
    
    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Unable to find structural metadata tracking parameters. Category lookups aborted.",
        data: [],
      };
    }

    const data = await getSkillCategoriesService(resolvedPortfolioId);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to query tech stack breakdown taxonomy registry files:", error);
    return {
      success: false,
      error: "Failed to assemble the requested custom portfolio content classification lists.",
      data: [],
    };
  }
}

export async function getSkillCategoryById(categoryId: string) {
  try {
    if (!categoryId) return { success: true, data: null };

    const data = await getSkillCategoryService(categoryId);
    return { success: true, data };
  } catch (error) {
    return handleSkillCategoryServerError(error, "Failed to track specific profile core tech category metrics context lines.");
  }
}

export async function updateSkillCategory(
  categoryId: string,
  data: {
    name?: string;
    displayOrder?: number;
  }
) {
  try {
    if (!categoryId) {
      return { success: false, error: "Missing distinct track classification indices identification key context." };
    }

    const result = await updateSkillCategoryService(categoryId, data);
    return { success: true, data: result };
  } catch (error) {
    return handleSkillCategoryServerError(error, "Failed to commit updated nomenclature configurations to skill category properties.");
  }
}

export async function deleteSkillCategory(categoryId: string) {
  try {
    if (!categoryId) {
      return { success: false, error: "Identification tracking code missing. Removal pipeline cancelled." };
    }

    const result = await deleteSkillCategoryService(categoryId);
    return { success: true, data: result };
  } catch (error) {
    return handleSkillCategoryServerError(error, "The specified modular tech category index row could not be cleared.");
  }
}

export async function reorderSkillCategories(
  portfolioId: string,
  categoryIds: string[]
) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());
    
    if (!resolvedPortfolioId) {
      return { success: false, error: "Target structural context identity criteria not resolved. Sorting aborted." };
    }

    if (!categoryIds || categoryIds.length === 0) {
      return { success: true, message: "Empty sequencing definitions grid list provided. Layout hierarchy unchanged." };
    }

    const result = await reorderSkillCategoriesService(resolvedPortfolioId, categoryIds);
    
    // Support either direct data passthroughs or custom map result layouts gracefully
    if (result && typeof result === "object" && "success" in result) {
      return result;
    }
    return { success: true, data: result };
  } catch (error) {
    return handleSkillCategoryServerError(error, "Failed to commit customized category grid sequence alignment reorders.");
  }
}