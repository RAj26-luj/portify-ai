"use server";

import {
  createCertification as createCertificationService,
  updateCertification as updateCertificationService,
  getCertifications as getCertificationsService,
  getCertification as getCertificationService,
  deleteCertification as deleteCertificationService,
  reorderCertifications as reorderCertificationsService,
  toggleFeaturedCertification as toggleFeaturedCertificationService,
  getFeaturedCertifications as getFeaturedCertificationsService,
} from "@/services/certification";
import { getPortfolioId } from "@/lib/get-portfolio-id";

/**
 * Transforms system exceptions into standard, structured payload formats
 * containing human-readable error messages for client-side flash notifications.
 */
function handleCertificationServerError(error: any, fallbackMessage: string) {
  console.error("Certification Service Server Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("portfolioId required") || errorMessage.includes("portfolioId not found")) {
    return { 
      success: false, 
      error: "Authentication mapping missing. Could not tie the credential record to a valid portfolio profile." 
    };
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return { 
      success: false, 
      error: "Credential database processing engine is temporarily locked. Please submit details again." 
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function createCertification(data: {
  portfolioId: string;
  name: string;
  issuer?: string;
  featured?: boolean;
  credentialId?: string;
  issueDate?: Date;
  expiryDate?: Date;
  credentialUrl?: string;
  certificateImage?: string;
  certificatePdf?: string;
  skillsCovered?: string[];
  displayOrder?: number;
}) {
  try {
    const resolvedPortfolioId = data.portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return { success: false, error: "Portfolio reference profile matching ID is missing. Record creation cancelled." };
    }

    if (!data.name) {
      return { success: false, error: "Certification name string parameter is required to initialize verification records." };
    }

    const { portfolioId, ...rest } = data;

    const result = await createCertificationService(resolvedPortfolioId, rest);
    return { success: true, data: result };
  } catch (error) {
    return handleCertificationServerError(error, "Failed to register new certification record details securely.");
  }
}

export async function updateCertification(
  id: string,
  data: {
    name?: string;
    issuer?: string;
    featured?: boolean;
    credentialId?: string;
    issueDate?: Date;
    expiryDate?: Date;
    credentialUrl?: string;
    certificateImage?: string;
    certificatePdf?: string;
    skillsCovered?: string[];
    displayOrder?: number;
  }
) {
  try {
    if (!id) {
      return { success: false, error: "Target certification reference identity parameter string is required." };
    }

    const result = await updateCertificationService(id, data);
    return { success: true, data: result };
  } catch (error) {
    return handleCertificationServerError(error, "Failed to apply cryptographic entry modifications to this certification.");
  }
}

export async function getCertifications(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return { 
        success: false, 
        error: "Unable to retrieve listings. Target portfolio specification identity cannot be parsed.",
        data: [] 
      };
    }

    const data = await getCertificationsService(resolvedPortfolioId);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch certifications catalog payload sync:", error);
    return { 
      success: false, 
      error: "Failed to load certificates registry stack stream feed.", 
      data: [] 
    };
  }
}

export async function getCertificationById(id: string) {
  try {
    if (!id) return { success: true, data: null };

    const data = await getCertificationService(id);
    return { success: true, data };
  } catch (error) {
    return handleCertificationServerError(error, "Failed to cross-reference system tracking verification details for this credential.");
  }
}

export async function deleteCertification(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Missing credential identity key configuration. Delete pipeline skipped." };
    }

    const result = await deleteCertificationService(id);
    return { success: true, data: result };
  } catch (error) {
    return handleCertificationServerError(error, "The specified verification credential could not be successfully removed.");
  }
}

export async function reorderCertifications(...args: Parameters<typeof reorderCertificationsService>) {
  try {
    const result = await reorderCertificationsService(...args);
    return { success: true, data: result };
  } catch (error) {
    return handleCertificationServerError(error, "Failed to commit updated sequence layout metrics back into structural store.");
  }
}

export async function toggleFeaturedCertification(...args: Parameters<typeof toggleFeaturedCertificationService>) {
  try {
    const result = await toggleFeaturedCertificationService(...args);
    return { success: true, data: result };
  } catch (error) {
    return handleCertificationServerError(error, "Unable to adjust highlight selection display rules configuration criteria.");
  }
}

export async function getFeaturedCertifications(...args: Parameters<typeof getFeaturedCertificationsService>) {
  try {
    const data = await getFeaturedCertificationsService(...args);
    return { success: true, data };
  } catch (error) {
    console.error("Failed executing priority credentials discovery track query routing:", error);
    return { 
      success: false, 
      error: "Could not filter highlighted credentials portfolio presentation indices.", 
      data: [] 
    };
  }
}