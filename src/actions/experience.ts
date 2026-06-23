"use server";

import { prisma } from "@/lib/prisma";
import { getPortfolioId } from "@/lib/get-portfolio-id";

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "FREELANCE" | "CONTRACT";

export type ExperienceInput = {
  id?: string;
  portfolioId: string;
  company: string;
  position: string;
  employmentType?: EmploymentType;
  location?: string;
  companyWebsite?: string;
  companyBanner?: string;
  companyLogo?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
  responsibilities?: string[];
  technologies?: string[];
  displayOrder?: number;
};

// Error
function handleExperienceServerError(error: any, fallbackMessage: string) {
  console.error("Experience Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("portfolioId required") ||
    errorMessage.includes("portfolioId not found")
  ) {
    return {
      success: false,
      error:
        "Authentication reference token is missing. Could not link experience timelines to an active portfolio.",
    };
  }
  if (errorMessage.includes("Experience ID is required")) {
    return {
      success: false,
      error: "Target record tracking indicator reference is missing from your action context.",
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
        "Corporate timeline storage engine is carrying out schema configurations. Please try again shortly.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function createExperience(data: ExperienceInput) {
  try {
    const resolvedPortfolioId = data.portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Portfolio verification credentials not resolved. Record creation aborted.",
      };
    }

    if (!data.company) {
      return {
        success: false,
        error: "Company or enterprise organization field name is required.",
      };
    }

    if (!data.position) {
      return {
        success: false,
        error: "Job title or operational staff designation description is required.",
      };
    }

    const result = await prisma.experience.create({
      data: {
        portfolioId: resolvedPortfolioId,
        company: data.company,
        position: data.position,
        employmentType: data.employmentType,
        location: data.location,
        companyWebsite: data.companyWebsite,
        companyBanner: data.companyBanner,
        companyLogo: data.companyLogo,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        currentlyWorking: data.currentlyWorking ?? false,
        description: data.description,
        responsibilities: data.responsibilities ?? [],
        technologies: data.technologies ?? [],
        displayOrder: data.displayOrder ?? 0,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleExperienceServerError(
      error,
      "Failed to instantiate new professional career experience context item."
    );
  }
}

export async function updateExperience(id: string, data: Partial<ExperienceInput>) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Missing unique structural identification mapping reference string key.",
      };
    }

    const result = await prisma.experience.update({
      where: { id },
      data: {
        company: data.company,
        position: data.position,
        employmentType: data.employmentType,
        location: data.location,
        companyWebsite: data.companyWebsite,
        companyBanner: data.companyBanner,
        companyLogo: data.companyLogo,
        currentlyWorking: data.currentlyWorking,
        description: data.description,
        responsibilities: data.responsibilities ?? [],
        technologies: data.technologies ?? [],
        displayOrder: data.displayOrder ?? 0,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleExperienceServerError(
      error,
      "Failed to apply corporate employment tracking modifications back into database store."
    );
  }
}

export async function getExperiences(portfolioId: string) {
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

    const data = await prisma.experience.findMany({
      where: { portfolioId: resolvedPortfolioId },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to compile historical employment timeline tracking grid lists:", error);
    return {
      success: false,
      error: "Failed to load corporate employment history tracking logs dashboard view.",
      data: [],
    };
  }
}

export async function getExperienceById(id: string) {
  try {
    if (!id) return { success: true, data: null };

    const data = await prisma.experience.findUnique({
      where: { id },
    });

    return { success: true, data };
  } catch (error) {
    return handleExperienceServerError(
      error,
      "Failed to track specific profile career milestone relationship records lines."
    );
  }
}

export async function deleteExperience(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error:
          "Missing experience tracking trace tracking key pointer. Removal sequence cancelled.",
      };
    }

    const result = await prisma.experience.delete({
      where: { id },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleExperienceServerError(
      error,
      "The specified employment timeline history row could not be successfully cleared."
    );
  }
}
