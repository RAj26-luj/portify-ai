"use server";

import {
  createSocialLink as createSocialLinkService,
  updateSocialLink as updateSocialLinkService,
  getSocialLinks as getSocialLinksService,
  getSocialLink as getSocialLinkService,
  deleteSocialLink as deleteSocialLinkService,
} from "@/services/social-link";

import { getPortfolioId } from "@/lib/get-portfolio-id";

/**
 * Transforms connectivity parameter errors, missing address vectors, or datastore lookup
 * glitches into structured, user-friendly objects tailored for instant UI toast alerts.
 */
function handleSocialLinkServerError(error: any, fallbackMessage: string) {
  console.error("Social Link Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("portfolioId required") || errorMessage.includes("portfolioId not found")) {
    return {
      success: false,
      error: "Authentication mapping missing. Could not link this handle to an active portfolio profile.",
    };
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return {
      success: false,
      error: "The directory router engine is currently executing background data logs. Please try again.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function createSocialLink(data: {
  portfolioId: string;
  platform: string;
  url: string;
  username?: string;
  iconName?: string;
  iconUrl?: string;
  iconSource?: "LIBRARY" | "USER_UPLOAD" | "DEFAULT_ICON";
  displayOrder?: number;
}) {
  try {
    const resolvedPortfolioId = data.portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return { success: false, error: "Portfolio connection target not found. Unable to anchor communication link." };
    }

    if (!data.platform) {
      return { success: false, error: "Platform name identifier (e.g., 'GitHub', 'LinkedIn') is required." };
    }

    if (!data.url) {
      return { success: false, error: "Target web address location URL parameter is required." };
    }

    const result = await createSocialLinkService(resolvedPortfolioId, {
      platform: data.platform,
      url: data.url,
      username: data.username,
      iconName: data.iconName,
      iconUrl: data.iconUrl,
      iconSource: data.iconSource,
      displayOrder: data.displayOrder,
    });

    return { success: true, data: result };
  } catch (error) {
    return handleSocialLinkServerError(error, "Failed to instantiate new media communication link parameter.");
  }
}

export async function updateSocialLink(
  id: string,
  data: {
    platform?: string;
    url?: string;
    username?: string;
    iconName?: string;
    iconUrl?: string;
    iconSource?: "LIBRARY" | "USER_UPLOAD" | "DEFAULT_ICON";
    displayOrder?: number;
  }
) {
  try {
    if (!id) {
      return { success: false, error: "Missing unique channel structural tracking identification pointer key." };
    }

    const result = await updateSocialLinkService(id, data);
    return { success: true, data: result };
  } catch (error) {
    return handleSocialLinkServerError(error, "Failed to commit updated address properties to routing handle fields.");
  }
}

export async function getSocialLinks(portfolioId: string) {
  try {
    const resolved = portfolioId || (await getPortfolioId());

    if (!resolved) {
      return {
        success: false,
        error: "Unable to sync social feeds. Portfolio validation trace identifier context is unverified.",
        data: [],
      };
    }

    const data = await getSocialLinksService(resolved);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to query networking index link registries records list:", error);
    return {
      success: false,
      error: "Failed to assemble the requested media channel connection directory lists.",
      data: [],
    };
  }
}

export async function getSocialLinkById(id: string) {
  try {
    if (!id) return { success: true, data: null };

    const data = await getSocialLinkService(id);
    return { success: true, data };
  } catch (error) {
    return handleSocialLinkServerError(error, "Failed to cross-reference system details configurations for this channel handle.");
  }
}

export async function deleteSocialLink(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Identification trace code reference missing. Removal pipeline cancelled." };
    }

    const result = await deleteSocialLinkService(id);
    return { success: true, data: result };
  } catch (error) {
    return handleSocialLinkServerError(error, "The specified external redirection gateway anchor row could not be cleared.");
  }
}