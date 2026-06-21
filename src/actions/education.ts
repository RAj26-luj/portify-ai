"use server";

import { prisma } from "@/lib/prisma";
import { getPortfolioId } from "@/lib/get-portfolio-id";

/**
 * Transforms education data validation or background database storage exceptions
 * into structured, client-friendly feedback models optimized for instant UI alerts.
 */
function handleEducationServerError(error: any, fallbackMessage: string) {
  console.error("Education Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("portfolioId required") || errorMessage.includes("portfolioId not found")) {
    return {
      success: false,
      error: "Authentication reference token is missing. Could not link education milestones to a portfolio profile.",
    };
  }
  if (errorMessage.includes("Invalid Education id")) {
    return {
      success: false,
      error: "The targeted academic record identifier parameter is invalid or empty.",
    };
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return {
      success: false,
      error: "Academic records storage engine is currently running data sync operations. Please submit details again.",
    };
  }

  return { success: false, error: fallbackMessage };
}

/* ---------------- CREATE ---------------- */
export async function createEducation(data: {
  portfolioId?: string;

  institution: string;
  degree: string;

  fieldOfStudy?: string;
  grade?: string;
  cgpa?: string;

  institutionImage?: string;
  location?: string;
  logoUrl?: string;

  startDate?: Date;
  endDate?: Date;

  currentlyStudying?: boolean;
  description?: string;

  displayOrder?: number;
}) {
  try {
    const resolvedPortfolioId = data.portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return { success: false, error: "Portfolio specification profile identification target not found." };
    }

    if (!data.institution) {
      return { success: false, error: "School or institution naming descriptor field parameter is required." };
    }

    if (!data.degree) {
      return { success: false, error: "Degree or certification type classification code label is required." };
    }

    const result = await prisma.education.create({
      data: {
        portfolioId: resolvedPortfolioId,

        institution: data.institution,
        degree: data.degree,

        fieldOfStudy: data.fieldOfStudy || undefined,
        grade: data.grade || undefined,
        cgpa: data.cgpa || undefined,

        institutionImage: data.institutionImage || undefined,
        location: data.location || undefined,
        logoUrl: data.logoUrl || undefined,

        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,

        currentlyStudying: data.currentlyStudying ?? false,
        description: data.description || undefined,

        displayOrder: data.displayOrder ?? 0,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleEducationServerError(error, "Failed to initialize new education history logging parameters.");
  }
}

/* ---------------- UPDATE (FIXED) ---------------- */
export async function updateEducation(id: string, data: any) {
  try {
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return { success: false, error: "Missing distinct track indices parameter identity key context." };
    }

    const cleanId = id.trim();

    // ✅ sanitize payload completely (THIS IS THE FIX)
    const cleanData = {
      institution: data.institution,
      degree: data.degree,

      fieldOfStudy: data.fieldOfStudy || undefined,
      grade: data.grade || undefined,
      cgpa: data.cgpa || undefined,

      institutionImage: data.institutionImage || undefined,
      location: data.location || undefined,
      logoUrl: data.logoUrl || undefined,

      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,

      currentlyStudying: data.currentlyStudying ?? false,
      description: data.description || undefined,

      displayOrder: data.displayOrder ?? undefined,
    };

    const result = await prisma.education.update({
      where: { id: cleanId },
      data: cleanData,
    });

    return { success: true, data: result };
  } catch (error) {
    return handleEducationServerError(error, "Failed to apply tracking modifications back onto education history fields.");
  }
}

/* ---------------- READ ALL ---------------- */
export async function getEducations(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Unable to sync academic logs. Target portfolio tracking context identifier was not verified.",
        data: [],
      };
    }

    const data = await prisma.education.findMany({
      where: {
        portfolioId: resolvedPortfolioId,
      },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to query historical training catalog streams timeline payload:", error);
    return {
      success: false,
      error: "Failed to compile background academic history list feed streams dashboard.",
      data: [],
    };
  }
}

/* ---------------- READ ONE ---------------- */
export async function getEducationById(id: string) {
  try {
    if (!id || id.trim().length === 0) {
      return { success: true, data: null };
    }

    const data = await prisma.education.findUnique({
      where: { id: id.trim() },
    });

    return { success: true, data };
  } catch (error) {
    return handleEducationServerError(error, "Failed to track specific profile education context data lines.");
  }
}

/* ---------------- DELETE ---------------- */
export async function deleteEducation(id: string) {
  try {
    if (!id || id.trim().length === 0) {
      return { success: false, error: "Academic tracking reference key index definition missing. Deletion sequence aborted." };
    }

    const result = await prisma.education.delete({
      where: { id: id.trim() },
    });

    return { success: true, data: result };
  } catch (error) {
    return handleEducationServerError(error, "The specified education timeline history record could not be successfully removed.");
  }
}