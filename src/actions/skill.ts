"use server";

import { prisma } from "@/lib/prisma";
import { IconSource, SkillLevel } from "@prisma/client";
import { getPortfolioId } from "@/lib/get-portfolio-id";

function isValidObjectId(id?: string | null) {
  return typeof id === "string" && /^[a-f\d]{24}$/i.test(id);
}

/**
 * Transforms software engine skill entries validation conflicts or relational datastore
 * exceptions into standardized, client-friendly signatures optimized for sleek UI notifications.
 */
function handleSkillServerError(error: any, fallbackMessage: string) {
  console.error("Skill Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("portfolioId required") || errorMessage.includes("portfolioId not found")) {
    return {
      success: false,
      error: "Authentication reference token is missing. Could not map engineering capability metrics to a profile.",
    };
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return {
      success: false,
      error: "The stack registry storage layout engine is carrying out configurations. Please try again shortly.",
    };
  }

  return { success: false, error: fallbackMessage };
}

/* ---------------- CREATE ---------------- */
export async function createSkill(data: {
  portfolioId?: string;
  categoryId?: string;
  name: string;
  proficiency?: SkillLevel;
  yearsOfExperience?: number;
  iconName?: string;
  iconUrl?: string;
  iconSource?: IconSource;
  description?: string;
  tag?: string;
  displayOrder?: number;
}) {
  try {
    const resolvedPortfolioId = data.portfolioId || (await getPortfolioId());
    
    if (!resolvedPortfolioId) {
      return { success: false, error: "Portfolio validation connection target identity parameter not found." };
    }

    if (!data.name) {
      return { success: false, error: "Skill label name or framework identification text is required." };
    }

    const result = await prisma.skill.create({
      data: {
        portfolioId: resolvedPortfolioId,
        categoryId: isValidObjectId(data.categoryId) ? data.categoryId : null,

        name: data.name,
        proficiency: data.proficiency,
        yearsOfExperience: data.yearsOfExperience,

        iconName: data.iconName,
        iconUrl: data.iconUrl,
        iconSource: data.iconSource ?? IconSource.LIBRARY,

        description: data.description,
        tag: data.tag,

        displayOrder: data.displayOrder ?? 0,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleSkillServerError(error, "Failed to instantiate new skill asset registry line tracking item.");
  }
}

/* ---------------- UPDATE ---------------- */
export async function updateSkill(
  id: string,
  data: {
    categoryId?: string | null;
    name?: string;
    proficiency?: SkillLevel;
    yearsOfExperience?: number;
    iconName?: string;
    iconUrl?: string;
    iconSource?: IconSource;
    description?: string;
    tag?: string;
    displayOrder?: number;
  }
) {
  try {
    if (!id) {
      return { success: false, error: "Missing unique tech framework tracking target mapping identity token parameter." };
    }

    const result = await prisma.skill.update({
      where: { id },
      data: {
        ...data,
        categoryId: isValidObjectId(data.categoryId) ? data.categoryId : null,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleSkillServerError(error, "Failed to apply operational skill properties adjustments onto database records.");
  }
}

/* ---------------- GET ALL ---------------- */
export async function getSkills(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Unable to sync tech matrix. Profile identification tracking code was not verified.",
        data: [],
      };
    }

    const data = await prisma.skill.findMany({
      where: { portfolioId: resolvedPortfolioId },
      include: { category: true },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to query complete technology proficiencies registry:", error);
    return {
      success: false,
      error: "Failed to assemble the historic technical skill set components view panel dashboards.",
      data: [],
    };
  }
}

/* ---------------- DELETE ---------------- */
export async function deleteSkill(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Unique tracking indicator value parameter string is empty. Sequence aborted." };
    }

    const result = await prisma.skill.delete({
      where: { id },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleSkillServerError(error, "The selected technical matrix framework row index could not be cleared.");
  }
}

/* ---------------- CATEGORY (unchanged but safe) ---------------- */

export async function createSkillCategory(data: {
  portfolioId?: string;
  name: string;
  displayOrder?: number;
}) {
  try {
    const resolvedPortfolioId = data.portfolioId || (await getPortfolioId());
    
    if (!resolvedPortfolioId) {
      return { success: false, error: "Portfolio framework identity matching validation context was not found." };
    }

    if (!data.name) {
      return { success: false, error: "Category group name tag descriptor or nomenclature parameter cannot be blank." };
    }

    const result = await prisma.skillCategory.create({
      data: {
        portfolioId: resolvedPortfolioId,
        name: data.name,
        displayOrder: data.displayOrder ?? 0,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleSkillServerError(error, "Failed to instantiate structural taxonomy category container for tech tracks.");
  }
}

export async function getSkillCategories(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Unable to pull skill groupings. Portfolio identifier data layer trace context is unverified.",
        data: [],
      };
    }

    const data = await prisma.skillCategory.findMany({
      where: { portfolioId: resolvedPortfolioId },
      include: {
        skills: {
          orderBy: { displayOrder: "asc" },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to compile stack category grouping matrix data trees items:", error);
    return {
      success: false,
      error: "Failed to load skills classified group stream components feed stack view dashboard.",
      data: [],
    };
  }
}

export async function deleteSkillCategory(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Target taxonomy grouping index reference trace identifier code string is required." };
    }

    // Set matching items category links to null to safely detach relations without hard dropping child records
    try {
      await prisma.skill.updateMany({
        where: { categoryId: id },
        data: { categoryId: null },
      });
    } catch (relationCleanupError) {
      console.error("Non-blocking child relational detachment exception within category drop workflow:", relationCleanupError);
    }

    const result = await prisma.skillCategory.delete({
      where: { id },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleSkillServerError(error, "The selected custom skill classification registry layout field block could not be cleared.");
  }
}