"use server";

import { getSectionSettings as getSectionSettingsService } from "@/services/section-setting";
import { getSectionSetting as getSectionSettingService } from "@/services/section-setting";
import { updateSectionSetting as updateSectionSettingService } from "@/services/section-setting";
import { reorderSectionSettings as reorderSectionSettingsService } from "@/services/section-setting";
import { getPortfolioId } from "@/lib/get-portfolio-id";
import { prisma } from "@/lib/prisma";

// Error
function handleSectionSettingServerError(error: any, fallbackMessage: string) {
  console.error("Section Setting Core Service Server Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("portfolioId required") ||
    errorMessage.includes("portfolioId not found")
  ) {
    return {
      success: false,
      error:
        "Authentication reference token is missing. Could not fetch or re-configure page layout options.",
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
        "The page visibility modifier tool is currently executing database optimizations. Please try again.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function getSectionSettings(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error:
          "Unable to find layout settings context. Target portfolio tracking identifier is unverified.",
        data: [],
      };
    }

    const data = await getSectionSettingsService(resolvedPortfolioId);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to query portfolio page layout component settings indices:", error);
    return {
      success: false,
      error: "Failed to assemble individual modular visibility parameters list streams feed.",
      data: [],
    };
  }
}

export async function getSectionSettingById(sectionSettingId: string) {
  try {
    if (!sectionSettingId) {
      return {
        success: false,
        error: "Unique modular section row token identifier was missing from request.",
        data: null,
      };
    }

    const data = await getSectionSettingService(sectionSettingId);
    return { success: true, data };
  } catch (error) {
    return handleSectionSettingServerError(
      error,
      "Failed to track specific profile presentation visibility config rules lines."
    );
  }
}

export async function updateSectionSetting(
  sectionSettingId: string,
  data: {
    title?: string;
    isEnabled?: boolean;
    mandatory?: boolean;
    displayOrder?: number;
  }
) {
  try {
    if (!sectionSettingId) {
      return {
        success: false,
        error: "Unique block layout row trace key signature missing. Re-configuration cancelled.",
      };
    }

    const result = await updateSectionSettingService(sectionSettingId, data);
    return { success: true, data: result };
  } catch (error) {
    return handleSectionSettingServerError(
      error,
      "Failed to save customized component rules configurations onto database layers."
    );
  }
}

export async function reorderSectionSettings(portfolioId: string, sectionIds: string[]) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Portfolio connection target identifier missing. Layout sequencing aborted.",
      };
    }

    if (!sectionIds || sectionIds.length === 0) {
      return {
        success: true,
        message: "Empty horizontal sorting layer metrics list stack. Grid order unchanged.",
      };
    }

    const result = await reorderSectionSettingsService(resolvedPortfolioId, sectionIds);

    if (result && typeof result === "object" && "success" in result) {
      return result;
    }
    return { success: true, data: result };
  } catch (error) {
    return handleSectionSettingServerError(
      error,
      "Failed to commit layout ordering priority parameters rules back into database store."
    );
  }
}

export async function resetSectionSettings(portfolioId?: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Portfolio tracking identifier trace reference context not resolved. Reset aborted.",
      };
    }

    const DEFAULT_SECTIONS = [
      {
        sectionKey: "hero",
        title: "Hero",
        mandatory: true,
        isEnabled: true,
        displayOrder: 0,
      },
      {
        sectionKey: "about",
        title: "About",
        mandatory: true,
        isEnabled: true,
        displayOrder: 1,
      },
      {
        sectionKey: "experience",
        title: "Experience",
        mandatory: false,
        isEnabled: true,
        displayOrder: 2,
      },
      {
        sectionKey: "education",
        title: "Education",
        mandatory: false,
        isEnabled: true,
        displayOrder: 3,
      },
      {
        sectionKey: "skills",
        title: "Skills",
        mandatory: false,
        isEnabled: true,
        displayOrder: 4,
      },
      {
        sectionKey: "projects",
        title: "Projects",
        mandatory: false,
        isEnabled: true,
        displayOrder: 5,
      },
      {
        sectionKey: "opensource",
        title: "Open Source",
        mandatory: false,
        isEnabled: true,
        displayOrder: 6,
      },
      {
        sectionKey: "achievements",
        title: "Achievements",
        mandatory: false,
        isEnabled: true,
        displayOrder: 7,
      },
      {
        sectionKey: "certifications",
        title: "Certifications",
        mandatory: false,
        isEnabled: true,
        displayOrder: 8,
      },
      {
        sectionKey: "publications",
        title: "Publications",
        mandatory: false,
        isEnabled: true,
        displayOrder: 9,
      },
      {
        sectionKey: "testimonials",
        title: "Testimonials",
        mandatory: false,
        isEnabled: true,
        displayOrder: 10,
      },
      {
        sectionKey: "codingprofiles",
        title: "Coding Profiles",
        mandatory: false,
        isEnabled: true,
        displayOrder: 11,
      },
      {
        sectionKey: "sociallinks",
        title: "Social Links",
        mandatory: false,
        isEnabled: true,
        displayOrder: 12,
      },
      {
        sectionKey: "contact",
        title: "Contact",
        mandatory: true,
        isEnabled: true,
        displayOrder: 999,
      },
    ];

    const existing = await prisma.sectionSetting.findMany({
      where: {
        portfolioId: resolvedPortfolioId,
      },
    });

    if (existing.length === 0) {
      const createdBatch = await prisma.sectionSetting.createMany({
        data: DEFAULT_SECTIONS.map((section) => ({
          portfolioId: resolvedPortfolioId,
          ...section,
        })),
      });

      return { success: true, data: createdBatch };
    }

    const transactionPayload = await prisma.$transaction(
      existing.map((setting) => {
        const match = DEFAULT_SECTIONS.find(
          (s) => s.sectionKey === setting.sectionKey.toLowerCase()
        );

        return prisma.sectionSetting.update({
          where: {
            id: setting.id,
          },
          data: {
            isEnabled: true,
            displayOrder: match?.displayOrder ?? 500,
          },
        });
      })
    );

    return { success: true, data: transactionPayload };
  } catch (error) {
    return handleSectionSettingServerError(
      error,
      "Failed to completely rebuild portfolio display grids to default dashboard settings parameters."
    );
  }
}
