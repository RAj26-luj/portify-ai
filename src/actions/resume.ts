"use server";

import { prisma } from "@/lib/prisma";
import { getPortfolioId } from "@/lib/get-portfolio-id";

/**
 * Transforms system document mutations, tracking queries, or cloud storage metadata schema failures
 * into uniform, consumer-friendly response payloads ideal for non-intrusive client UI flashes.
 */
function handleResumeServerError(error: any, fallbackMessage: string) {
  console.error("Resume Core Configuration Server Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("Portfolio not found")) {
    return {
      success: false,
      error: "Authentication reference token is missing. Could not tie active document assets to a portfolio profile.",
    };
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return {
      success: false,
      error: "Document asset management store is temporarily busy processing logs. Please upload or save again.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function getResume(
  portfolioId?: string
) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return { 
        success: false, 
        error: "Unable to trace active records. No target portfolio mapping tracking identifier found.",
        data: null 
      };
    }

    const data = await prisma.resume.findUnique({
      where: {
        portfolioId: resolvedPortfolioId,
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch active master resume configuration file entity layout:", error);
    return {
      success: false,
      error: "Could not safely pull master resume file information tracks.",
      data: null,
    };
  }
}

export async function getResumeVersions(
  portfolioId?: string
) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Unable to sync backup versions. Identification parameter mapping profile context is missing.",
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
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to trace chronological data snapshots for resume attachments registry:", error);
    return {
      success: false,
      error: "Failed to assemble the historic document backup version listings feed.",
      data: [],
    };
  }
}

export async function saveResume(
  fileName: string,
  fileUrl: string
) {
  try {
    const portfolioId = await getPortfolioId();

    if (!portfolioId) {
      return { success: false, error: "Portfolio connection context target not resolved. Save operation aborted." };
    }

    if (!fileName) {
      return { success: false, error: "A valid file name descriptor string parameter must be supplied to save file meta indicators." };
    }

    if (!fileUrl) {
      return { success: false, error: "Cloud hosting target link resource address is required to register files." };
    }

    await prisma.resume.upsert({
      where: {
        portfolioId,
      },
      update: {
        fileName,
        fileUrl,
      },
      create: {
        portfolioId,
        fileName,
        fileUrl,
      },
    });

    await prisma.resumeVersion.create({
      data: {
        portfolioId,
        fileName,
        fileUrl,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    return handleResumeServerError(error, "Failed to commit master file metadata settings onto profile registries.");
  }
}

export async function deleteResumeVersion(
  id: string
) {
  try {
    if (!id) {
      return { success: false, error: "Identification trace key definition missing. Removal pipeline cancelled." };
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
    return handleResumeServerError(error, "The selected historical document variant copy could not be cleared from the system.");
  }
}