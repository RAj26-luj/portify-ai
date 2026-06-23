"use server";

import { prisma } from "@/lib/prisma";

import { importResume } from "@/services/resume/import-resume";

import type { ParsedResume } from "@/types/parsed-resume";

// Error
function handleResumeImportServerError(error: any, fallbackMessage: string) {
  console.error("Resume Import Core Service Server Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("Portfolio not found")) {
    return {
      success: false,
      error:
        "The targeted portfolio validation profile could not be located to attach resume assets.",
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
        "The structural parsing database engine is temporarily timed out. Please trigger the file import again.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function importResumeAction(
  portfolioId: string,
  resume: ParsedResume,
  fileName?: string,
  fileUrl?: string
) {
  try {
    if (!portfolioId) {
      return {
        success: false,
        error: "Portfolio connection target identifier missing. Resume import cancelled.",
      };
    }

    if (!resume) {
      return {
        success: false,
        error: "Parsed resume structural data token parameter is required.",
      };
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: {
        id: portfolioId,
      },
      select: {
        id: true,
      },
    });

    if (!portfolio) {
      return {
        success: false,
        error: "Import profile alignment failed: Target portfolio does not exist.",
      };
    }

    const result = await importResume(portfolioId, resume, fileName, fileUrl);

    return { success: true, data: result };
  } catch (error) {
    return handleResumeImportServerError(
      error,
      "Failed to completely inject and map document data into portfolio schemas."
    );
  }
}

export async function getResumeImportStatus(portfolioId: string) {
  try {
    if (!portfolioId) {
      return {
        success: false,
        error: "Portfolio tracking context token missing from status parameters context search.",
        data: null,
      };
    }

    const data = await prisma.portfolio.findUnique({
      where: {
        id: portfolioId,
      },
      select: {
        id: true,
        completionScore: true,
        profileCompleted: true,
        onboardingCompleted: true,
        publishReady: true,
        lastAnalyzedAt: true,
        pendingFields: true,
        pendingQuestions: true,
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to compile layout completion checks dashboard view streams:", error);
    return {
      success: false,
      error: "Failed to load real-time resume extraction status matrices dashboard.",
      data: null,
    };
  }
}
