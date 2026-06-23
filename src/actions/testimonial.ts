"use server";

import {
  createTestimonial as createTestimonialService,
  updateTestimonial as updateTestimonialService,
  deleteTestimonial as deleteTestimonialService,
  getTestimonials as getTestimonialsService,
  getTestimonial as getTestimonialService,
} from "@/services/testimonial";
import { getPortfolioId } from "@/lib/get-portfolio-id";

// Error
function handleTestimonialServerError(error: any, fallbackMessage: string) {
  console.error("Testimonial Endorsement Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("portfolioId required") ||
    errorMessage.includes("portfolioId not found")
  ) {
    return {
      success: false,
      error:
        "Authentication mapping missing. Could not link this endorsement to an active portfolio profile.",
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
        "The recommendation registry index engine is temporarily performing maintenance log syncs. Please try again.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function createTestimonial(data: {
  portfolioId: string;
  authorName: string;
  authorRole?: string;
  company?: string;
  testimonial: string;
  profileImage?: string;
  linkedinUrl?: string;
  companyLogo?: string;
  featured?: boolean;
}) {
  try {
    const resolvedPortfolioId = data.portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Portfolio connection target not found. Unable to anchor client recommendation.",
      };
    }

    if (!data.authorName) {
      return {
        success: false,
        error: "Reviewer name or endorsing authority parameter text cannot be left blank.",
      };
    }

    if (!data.testimonial) {
      return {
        success: false,
        error: "Endorsement feedback summary description statement content is required.",
      };
    }

    const result = await createTestimonialService(resolvedPortfolioId, {
      authorName: data.authorName,
      authorRole: data.authorRole,
      company: data.company,
      testimonial: data.testimonial,
      profileImage: data.profileImage,
      linkedinUrl: data.linkedinUrl,
      companyLogo: data.companyLogo,
      featured: data.featured,
    });

    return { success: true, data: result };
  } catch (error) {
    return handleTestimonialServerError(
      error,
      "Failed to instantiate new historical professional endorsement record details."
    );
  }
}

export async function updateTestimonial(
  id: string,
  data: {
    authorName?: string;
    authorRole?: string;
    company?: string;
    testimonial?: string;
    profileImage?: string;
    linkedinUrl?: string;
    companyLogo?: string;
    featured?: boolean;
    displayOrder?: number;
  }
) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Missing distinct peer review structural mapping reference string key tracker.",
      };
    }

    const result = await updateTestimonialService(id, data);
    return { success: true, data: result };
  } catch (error) {
    return handleTestimonialServerError(
      error,
      "Failed to commit updated endorsement configurations onto properties fields."
    );
  }
}

export async function getTestimonials(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Unable to find structural evaluation metrics tracks. Endorsement lookups aborted.",
        data: [],
      };
    }

    const data = await getTestimonialsService(resolvedPortfolioId);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to query recommendation timeline reference data feeds:", error);
    return {
      success: false,
      error:
        "Failed to assemble the requested client reviews dashboard layout catalogs grid lists.",
      data: [],
    };
  }
}

export async function getTestimonialById(id: string) {
  try {
    if (!id) return { success: true, data: null };

    const data = await getTestimonialService(id);
    return { success: true, data };
  } catch (error) {
    return handleTestimonialServerError(
      error,
      "Failed to cross-reference structural tracking context logs for this endorsement row."
    );
  }
}

export async function deleteTestimonial(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Identification trace criteria code reference missing. Removal sequence aborted.",
      };
    }

    const result = await deleteTestimonialService(id);
    return { success: true, data: result };
  } catch (error) {
    return handleTestimonialServerError(
      error,
      "The selected peer endorsement feedback row index could not be cleared."
    );
  }
}
