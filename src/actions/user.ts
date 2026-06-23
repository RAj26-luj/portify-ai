"use server";

import { auth } from "@/auth";
import { UserStatus } from "@prisma/client";

import {
  getProfile as getProfileService,
  updateProfile as updateProfileService,
} from "@/services/user";

import { profileSchema } from "@/validators/profile";
import type { ProfileUpdateDTO } from "@/validators/profile";

import { createAuditLog, logUserBlocked } from "@/lib/audit-log";

import { prisma } from "@/lib/prisma";
import { sendBlockedEmail, sendUnblockedEmail } from "@/services/email";

interface ServerActionResponse<T> {
  success: boolean;
  error: string | null;
  data: T | null;
}

// Error
function handleProfileServerError(error: any, fallbackMessage: string): ServerActionResponse<any> {
  console.error("Profile Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("Unauthorized")) {
    return {
      success: false,
      error: "Access denied. Please sign in to modify or retrieve profile information.",
      data: null,
    };
  }
  if (errorMessage.includes("User not found")) {
    return {
      success: false,
      error: "Profile search failed. The authenticated user record does not exist.",
      data: null,
    };
  }
  if (errorMessage.includes("ZodError") || errorMessage.includes("validation")) {
    return {
      success: false,
      error: "Form verification failed. Please check your data formatting constraints.",
      data: null,
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
        "The core identity profile engine is performing maintenance optimizations. Please try again shortly.",
      data: null,
    };
  }

  return { success: false, error: fallbackMessage, data: null };
}

export async function getProfile(): Promise<ServerActionResponse<any>> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return {
        success: false,
        error: "Session validation token is expired or unauthorized.",
        data: null,
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return {
        success: false,
        error: "Could not retrieve info. User mapping not found.",
        data: null,
      };
    }

    const data = await getProfileService(user.id);
    return { success: true, error: null, data };
  } catch (error) {
    return handleProfileServerError(
      error,
      "Failed to compile your background metadata configuration layout."
    );
  }
}

export async function updateProfile(formData: unknown): Promise<ServerActionResponse<any>> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized session access credentials. Mutation rejected.",
        data: null,
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return {
        success: false,
        error: "Target account records do not exist. Profile save aborted.",
        data: null,
      };
    }

    let validatedData;
    try {
      validatedData = profileSchema.parse({
        ...(formData as any),
        email: user.email,
      });
    } catch (parseError) {
      return handleProfileServerError(
        parseError,
        "Failed parsing form parameters. Check required fields constraints."
      );
    }

    const safeUserData: ProfileUpdateDTO = {
      name: validatedData.name,
      phone: validatedData.phone,
      image: validatedData.image,
      coverImage: validatedData.coverImage,
      website: validatedData.website,
      country: validatedData.country,
      state: validatedData.state,
      city: validatedData.city,

      title: validatedData.title,
      tagline: validatedData.tagline,
      bio: validatedData.bio,

      profileImage: validatedData.profileImage,
      coverPortfolioImage: validatedData.coverPortfolioImage,

      resumeHeadline: validatedData.resumeHeadline,
      currentRole: validatedData.currentRole,

      phonePortfolio: validatedData.phonePortfolio,
      emailPortfolio: validatedData.emailPortfolio,
      websitePortfolio: validatedData.websitePortfolio,
      countryPortfolio: validatedData.countryPortfolio,
      statePortfolio: validatedData.statePortfolio,
      cityPortfolio: validatedData.cityPortfolio,

      timezone: validatedData.timezone,

      allowContactForm: validatedData.allowContactForm,
      allowResumeDownload: validatedData.allowResumeDownload,

      seoTitle: validatedData.seoTitle,
      seoDescription: validatedData.seoDescription,
      seoKeywords: validatedData.seoKeywords,
      seoImage: validatedData.seoImage,

      ogTitle: validatedData.ogTitle,
      ogSubtitle: validatedData.ogSubtitle,
      ogDescription: validatedData.ogDescription,
      ogImage: validatedData.ogImage,

      primaryButtonText: validatedData.primaryButtonText,
      primaryButtonUrl: validatedData.primaryButtonUrl,
      secondaryButtonText: validatedData.secondaryButtonText,
      secondaryButtonUrl: validatedData.secondaryButtonUrl,

      currentFocus: validatedData.currentFocus,
      availabilityStatus: validatedData.availabilityStatus,

      aboutImage: validatedData.aboutImage,
      contactAvailability: validatedData.contactAvailability,
      twitterImage: validatedData.twitterImage,

      description: validatedData.description,
      heroIntroduction: validatedData.heroIntroduction,
    };

    const result = await updateProfileService(user.id, safeUserData);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        image: validatedData.image ?? undefined,
        coverImage: validatedData.coverImage ?? undefined,
      },
    });

    await prisma.portfolio.update({
      where: { userId: user.id },
      data: {
        profileImage: validatedData.profileImage ?? validatedData.image ?? undefined,
        coverImage: validatedData.coverPortfolioImage ?? validatedData.coverImage ?? undefined,
      },
    });

    try {
      await createAuditLog("PROFILE_UPDATED", user.id, {
        email: user.email,
      });
    } catch (auditError) {
      console.error("Non-blocking profile update log footprint registration failed:", auditError);
    }

    return { success: true, error: null, data: result };
  } catch (error) {
    return handleProfileServerError(
      error,
      "The configuration save chain encountered an unhandled data fault layer."
    );
  }
}

export async function getUserById(id: string): Promise<ServerActionResponse<any>> {
  try {
    if (!id) return { success: true, error: null, data: null };

    const data = await prisma.user.findUnique({
      where: { id },
      include: {
        portfolio: true,
        approvalRequest: true,
      },
    });
    return { success: true, error: null, data };
  } catch (error) {
    return handleProfileServerError(
      error,
      "Failed to cross-reference administrative user credentials trace records."
    );
  }
}

export async function getUsers(): Promise<ServerActionResponse<any[]>> {
  try {
    const data = await prisma.user.findMany({
      include: { portfolio: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, error: null, data };
  } catch (error) {
    console.error(
      "Failed executing quantitative query calculation for administrative user tracking streams:",
      error
    );
    return {
      success: false,
      error: "Failed to assemble background directory account list feeds configuration.",
      data: [],
    };
  }
}

export async function approveUser(id: string): Promise<ServerActionResponse<any>> {
  try {
    if (!id) {
      return {
        success: false,
        error: "Account unique lookup selector identity criteria token is required.",
        data: null,
      };
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.APPROVED,
        approvedAt: new Date(),
      },
    });

    try {
      await createAuditLog("USER_APPROVED", user.id, {
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } catch (logError) {
      console.error(
        "Non-blocking administrative audit trace log sequence allocation exception:",
        logError
      );
    }

    return { success: true, error: null, data: user };
  } catch (error) {
    return handleProfileServerError(
      error,
      "The administrative approval state modifier query tracking failed."
    );
  }
}

export async function rejectUser(id: string): Promise<ServerActionResponse<any>> {
  try {
    if (!id) {
      return {
        success: false,
        error: "Account unique lookup selector identity criteria token is required.",
        data: null,
      };
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.REJECTED,
      },
    });

    try {
      await createAuditLog("USER_REJECTED", user.id, {
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } catch (logError) {
      console.error(
        "Non-blocking administrative audit trace log sequence allocation exception:",
        logError
      );
    }

    return { success: true, error: null, data: user };
  } catch (error) {
    return handleProfileServerError(
      error,
      "The administrative rejection modifier operation parameters failed."
    );
  }
}

export async function updateUserProfile(
  id: string,
  data: {
    name?: string;
    phone?: string;
    image?: string;
    website?: string;
    country?: string;
    state?: string;
    city?: string;
  }
): Promise<ServerActionResponse<any>> {
  try {
    if (!id) {
      return {
        success: false,
        error: "Distinct user index parameter reference context identification string is required.",
        data: null,
      };
    }

    const result = await prisma.user.update({
      where: { id },
      data,
    });

    return { success: true, error: null, data: result };
  } catch (error) {
    return handleProfileServerError(
      error,
      "Failed to apply tracking modifications on system level database layers."
    );
  }
}

export async function deleteUser(id: string): Promise<ServerActionResponse<any>> {
  try {
    if (!id) {
      return {
        success: false,
        error: "Identification tracer index string missing. Account wipe sequence dropped.",
        data: null,
      };
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return {
        success: false,
        error: "Account lookup failed. Target entity targeted for removal does not exist.",
        data: null,
      };
    }

    try {
      await createAuditLog("USER_DELETED", user.id, {
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } catch (auditError) {
      console.error(
        "Non-blocking deletion configuration metrics tracking footprint failed:",
        auditError
      );
    }

    const result = await prisma.user.delete({
      where: { id },
    });

    return { success: true, error: null, data: result };
  } catch (error) {
    return handleProfileServerError(
      error,
      "The target directory registration record row could not be successfully dropped."
    );
  }
}

export async function blockUser(id: string): Promise<ServerActionResponse<any>> {
  try {
    if (!id) {
      return {
        success: false,
        error: "Target operational block validation key mapping is empty.",
        data: null,
      };
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isBlocked: true },
    });

    try {
      await sendBlockedEmail(user.email);
    } catch (mailError) {
      console.error(
        "Non-blocking security alert suspension transmission notification courier failed:",
        mailError
      );
    }

    try {
      await logUserBlocked(user.id, {
        email: user.email,
        blocked: true,
      });
    } catch (logError) {
      console.error("Non-blocking suspension ledger audit stream save fault:", logError);
    }

    return { success: true, error: null, data: user };
  } catch (error) {
    return handleProfileServerError(
      error,
      "The administrative security block state execution pipeline encountered a datastore error."
    );
  }
}

export async function unblockUser(id: string): Promise<ServerActionResponse<any>> {
  try {
    if (!id) {
      return {
        success: false,
        error: "Target operational reinstatement validation key mapping is empty.",
        data: null,
      };
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isBlocked: false },
    });

    try {
      await sendUnblockedEmail(user.email);
    } catch (mailError) {
      console.error(
        "Non-blocking security reinforcement reactivation courier failed to broadcast:",
        mailError
      );
    }

    try {
      await logUserBlocked(user.id, {
        email: user.email,
        blocked: false,
      });
    } catch (logError) {
      console.error("Non-blocking reactivation log track marker index save exception:", logError);
    }

    return { success: true, error: null, data: user };
  } catch (error) {
    return handleProfileServerError(
      error,
      "The administrative access restoration sequence tracking criteria failed."
    );
  }
}
