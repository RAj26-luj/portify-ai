"use server";

import { prisma } from "@/lib/prisma";
import { getPortfolioId } from "@/lib/get-portfolio-id";

/**
 * Transforms system fetch anomalies, nested relation lookup limits, or data layer 
 * configurations into uniform, user-friendly responses tailored for non-intrusive UI flashes.
 */
function handlePortfolioServerError(error: any, fallbackMessage: string) {
  console.error("Portfolio Core Service Server Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("portfolioId required") || errorMessage.includes("portfolioId not found")) {
    return {
      success: false,
      error: "Authentication reference token is missing. Could not locate a valid portfolio account.",
    };
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return {
      success: false,
      error: "The portfolio schema core database engine is temporarily busy syncing. Please pull to refresh.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function getPortfolioByUserId(userId: string) {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User credential specification identity token parameter string is missing.",
        data: null,
      };
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
      include: {
        user: true,
        resume: true,
        analytics: true,
        themePreference: true,
        sectionSettings: { orderBy: { displayOrder: "asc" } },
        projects: {
          include: { metrics: true },
          orderBy: { displayOrder: "asc" },
        },
        educations: { orderBy: { displayOrder: "asc" } },
        experiences: { orderBy: { displayOrder: "asc" } },
        skills: {
          include: { category: true },
          orderBy: { displayOrder: "asc" },
        },
        skillCategories: { orderBy: { displayOrder: "asc" } },
        achievements: { orderBy: { displayOrder: "asc" } },
        certifications: { orderBy: { displayOrder: "asc" } },
        publications: { orderBy: { displayOrder: "asc" } },
        testimonials: { orderBy: { displayOrder: "asc" } },
        socialLinks: { orderBy: { displayOrder: "asc" } },
        codingProfiles: { orderBy: { displayOrder: "asc" } },
        
        // Modified: Added nested inclusion and ordering for custom section items
        customSections: {
          include: {
            items: {
              orderBy: {
                displayOrder: "asc",
              },
            },
          },
          orderBy: {
            displayOrder: "asc",
          },
        },
        
        openSourceProjects: {
          include: { timeline: true },
          orderBy: { displayOrder: "asc" },
        },
        media: true,
        contactMessages: { orderBy: { createdAt: "desc" } },
        views: true,
        resumeDownloads: true,
        projectClicks: true,
      },
    });

    if (!portfolio) {
      return { success: true, data: null };
    }

    return { success: true, data: portfolio };
  } catch (error) {
    console.error("Failed to construct full deep portfolio entity map hierarchy:", error);
    return {
      success: false,
      error: "Failed to assemble the administrative portfolio schema configuration views.",
      data: null,
    };
  }
}

export async function getPortfolioByUsername(username: string) {
  try {
    if (!username) {
      return {
        success: false,
        error: "Public handle username context argument is required.",
        data: null,
      };
    }

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        username,
        isPublic: true,
        status: "PUBLISHED",
      },
      include: {
        resume: true,
        analytics: true,
        themePreference: true,
        sectionSettings: {
          where: { isEnabled: true },
          orderBy: { displayOrder: "asc" },
        },
        projects: {
          include: { metrics: true },
          orderBy: { displayOrder: "asc" },
        },
        educations: { orderBy: { displayOrder: "asc" } },
        experiences: { orderBy: { displayOrder: "asc" } },
        skills: {
          include: { category: true },
          orderBy: { displayOrder: "asc" },
        },
        skillCategories: { orderBy: { displayOrder: "asc" } },
        achievements: { orderBy: { displayOrder: "asc" } },
        certifications: { orderBy: { displayOrder: "asc" } },
        publications: { orderBy: { displayOrder: "asc" } },
        testimonials: { orderBy: { displayOrder: "asc" } },
        socialLinks: { orderBy: { displayOrder: "asc" } },
        codingProfiles: { orderBy: { displayOrder: "asc" } },
        
        // Modified: Added nested inclusion alongside visibility filtering
        customSections: {
          where: {
            isVisible: true,
          },
          include: {
            items: {
              orderBy: {
                displayOrder: "asc",
              },
            },
          },
          orderBy: {
            displayOrder: "asc",
          },
        },
        
        openSourceProjects: {
          include: { timeline: true },
          orderBy: { displayOrder: "asc" },
        },
        media: true,
      },
    });

    return { success: true, data: portfolio };
  } catch (error) {
    console.error("Failed to resolve public facing portfolio layout file:", error);
    return {
      success: false,
      error: "Unable to parse requested public presentation files layer stream.",
      data: null,
    };
  }
}

export async function getPortfolio(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return { success: true, data: null };
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: resolvedPortfolioId },
      include: {
        analytics: true,
        resume: true,
        themePreference: true,
        sectionSettings: true,
      },
    });

    return { success: true, data: portfolio };
  } catch (error) {
    return handlePortfolioServerError(error, "Failed to load core target parameters configuration indices.");
  }
}

export async function createPortfolio(
  userId: string,
  username: string,
  category:
    | "STUDENT"
    | "WORKING_PROFESSIONAL"
    | "FREELANCER"
    | "RESEARCHER"
    | "STARTUP_FOUNDER" = "STUDENT"
) {
  try {
    if (!userId) {
      return { success: false, error: "Account initialization failed: User target identifier missing." };
    }
    if (!username) {
      return { success: false, error: "Account initialization failed: Clean routing username is required." };
    }

    const result = await prisma.portfolio.create({
      data: { userId, username, category },
    });

    return { success: true, data: result };
  } catch (error) {
    return handlePortfolioServerError(error, "Failed to instantiate new structural base portfolio configuration slot.");
  }
}

export async function updatePortfolio(
  portfolioId: string,
  data: Record<string, unknown>
) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return { success: false, error: "Missing operational reference verification ID code context." };
    }

    const result = await prisma.portfolio.update({
      where: { id: resolvedPortfolioId },
      data,
    });

    return { success: true, data: result };
  } catch (error) {
    return handlePortfolioServerError(error, "Failed to save configuration layout updates back onto core metadata fields.");
  }
}

export async function publishPortfolio(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return { success: false, error: "Missing operational verification token context link. Deployment aborted." };
    }

    const result = await prisma.portfolio.update({
      where: { id: resolvedPortfolioId },
      data: {
        status: "PUBLISHED",
        isPublic: true,
        publishedAt: new Date(),
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return handlePortfolioServerError(error, "The configuration deployment release sequence encountered a data layer failure.");
  }
}

export async function exportPortfolio(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return { success: true, data: null };
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: resolvedPortfolioId },
      include: {
        resume: true,
        analytics: true,
        themePreference: true,
        sectionSettings: true,
        projects: { include: { metrics: true } },
        educations: true,
        experiences: true,
        skills: { include: { category: true } },
        skillCategories: true,
        achievements: true,
        certifications: true,
        publications: true,
        testimonials: true,
        socialLinks: true,
        codingProfiles: true,
        
        // Modified: Changed true boolean flag to an inclusive operational query map
        customSections: {
          include: {
            items: {
              orderBy: {
                displayOrder: "asc",
              },
            },
          },
        },
        
        openSourceProjects: { include: { timeline: true } },
        media: true,
        views: true,
        contactMessages: true,
        resumeDownloads: true,
        projectClicks: true,
        snapshots: true,
        themeHistories: true,
      },
    });

    return { success: true, data: portfolio };
  } catch (error) {
    console.error("Failed to execute recursive relational backup snapshot stream aggregation:", error);
    return {
      success: false,
      error: "Could not safely pack configuration tables matrix data payload arrays for export.",
      data: null,
    };
  }
}

export async function getMyPortfolioId() {
  try {
    const data = await getPortfolioId();
    return { success: true, data };
  } catch (error) {
    console.error("Failed handling background target session parsing trace lookup:", error);
    return { success: false, error: "Active session mapping parameters lookup failed or expired.", data: null };
  }
}