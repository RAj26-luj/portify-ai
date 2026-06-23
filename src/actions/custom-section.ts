"use server";

import { getPortfolioId } from "@/lib/get-portfolio-id";
import {
  createCustomSection as createCustomSectionService,
  updateCustomSection as updateCustomSectionService,
  getCustomSections as getCustomSectionsService,
  getCustomSection as getCustomSectionService,
  deleteCustomSection as deleteCustomSectionService,
} from "@/services/custom-section";
import { revalidatePath } from "next/cache";

// Error
function handleCustomSectionServerError(error: any, fallbackMessage: string) {
  console.error("Custom Section Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("portfolioId required") ||
    errorMessage.includes("portfolioId not found")
  ) {
    return {
      success: false,
      error:
        "Authentication mapping missing. Could not link this custom section to an active portfolio profile.",
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
        "The custom layout engine is temporarily locked while performing maintenance. Please try again.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function createCustomSection(data: {
  portfolioId: string;
  title: string;
  subtitle?: string;
  description?: string;
  richTextContent?: string;
  imageUrl?: string;
  galleryImages?: string[];
  attachments?: string[];
  buttonText?: string;
  buttonUrl?: string;
  iconUrl?: string;
  sectionType?: string;
  isVisible?: boolean;
  displayOrder?: number;
}) {
  try {
    const resolvedPortfolioId = data.portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Portfolio connection target not found. Unable to create custom section.",
      };
    }

    if (!data.title) {
      return { success: false, error: "Section title is required. Please supply a section name." };
    }

    const { portfolioId, ...rest } = data;

    const result = await createCustomSectionService(resolvedPortfolioId, rest);

    try {
      revalidatePath("/dashboard");
    } catch (e) {
      console.error("Non-blocking revalidation failure during section create:", e);
    }

    return { success: true, data: result };
  } catch (error) {
    return handleCustomSectionServerError(
      error,
      "Failed to instantiate a new custom section module layout."
    );
  }
}

export async function updateCustomSection(
  id: string,
  data: {
    title?: string;
    subtitle?: string;
    description?: string;
    richTextContent?: string;
    imageUrl?: string;
    galleryImages?: string[];
    attachments?: string[];
    buttonText?: string;
    buttonUrl?: string;
    iconUrl?: string;
    sectionType?: string;
    isVisible?: boolean;
    displayOrder?: number;
  }
) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Missing custom section configuration identity tracker key.",
      };
    }

    const result = await updateCustomSectionService(id, data);

    try {
      revalidatePath("/dashboard");
    } catch (e) {
      console.error("Non-blocking revalidation failure during section update:", e);
    }

    return { success: true, data: result };
  } catch (error) {
    return handleCustomSectionServerError(
      error,
      "Unable to save configuration settings to this custom section layout."
    );
  }
}

export async function getCustomSections(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error:
          "Unable to retrieve modular layout components. No portfolio tracking identifier found.",
        data: [],
      };
    }

    const data = await getCustomSectionsService(resolvedPortfolioId);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch custom section stack stream payload sync:", error);
    return {
      success: false,
      error: "Failed to load custom portfolio components list feed.",
      data: [],
    };
  }
}

export async function getCustomSectionById(id: string) {
  try {
    if (!id) return { success: true, data: null };

    const data = await getCustomSectionService(id);
    return { success: true, data };
  } catch (error) {
    return handleCustomSectionServerError(
      error,
      "Failed to load specified unique section layout elements registry."
    );
  }
}

export async function deleteCustomSection(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Identification key reference missing. Removal pipeline cancelled.",
      };
    }

    const result = await deleteCustomSectionService(id);

    try {
      revalidatePath("/dashboard");
    } catch (e) {
      console.error("Non-blocking revalidation failure during section delete:", e);
    }

    return { success: true, data: result };
  } catch (error) {
    return handleCustomSectionServerError(
      error,
      "The selected modular section block could not be successfully cleared."
    );
  }
}
