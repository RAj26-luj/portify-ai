"use server";

import { prisma } from "@/lib/prisma";

import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "@/services/email";

import {
  logUserApproval,
  logUserBlocked,
} from "@/lib/audit-log";

import {
  ApprovalStatus,
  UserStatus,
} from "@prisma/client";

/**
 * Standard server exception handler translating structural validation, database, 
 * or background mailing pipeline issues into client-friendly error flashes.
 */
function handleApprovalServerError(
  error: any,
  fallbackMessage: string
): {
  success: false;
  error: string;
} {
  console.error("Approval Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return { 
      success: false, 
      error: "Structural modification rejected. Database logging system is currently unreachable." 
    };
  }
  if (errorMessage.includes("mail") || errorMessage.includes("smtp") || errorMessage.includes("send")) {
    return { 
      success: false, 
      error: "State partially updated, but notifications dispatch failed. Review network connectivity." 
    };
  }
  return { success: false, error: fallbackMessage };
}

export async function approveUser(
  userId: string
) {
  try {
    if (!userId) {
      return { success: false, error: "Target user parameter reference identifier is required." };
    }

    const user =
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          status:
            UserStatus.APPROVED,
          approvedAt:
            new Date(),
          approvalNote:
            null,
        },
      });

    await prisma.approvalRequest.upsert(
      {
        where: {
          userId,
        },
        update: {
          status:
            ApprovalStatus.APPROVED,
          reviewedAt:
            new Date(),
        },
        create: {
          userId,
          status:
            ApprovalStatus.APPROVED,
          reviewedAt:
            new Date(),
        },
      }
    );

    // Background notifications execution wrapped carefully to avoid full workflow blockages
    try {
      await sendApprovalEmail(user.email);
    } catch (mailError) {
      console.error("Non-blocking email delivery failure during user approval:", mailError);
    }

    try {
      await logUserApproval(
        user.id,
        {
          email:
            user.email,
          status:
            UserStatus.APPROVED,
        }
      );
    } catch (logError) {
      console.error("Non-blocking audit registration logging failed:", logError);
    }

    return {
      success: true,
      userId:
        user.id,
    };
  } catch (error) {
    return handleApprovalServerError(error, "Failed to complete account approval lifecycle execution flow.");
  }
}

export async function rejectUser(
  userId: string,
  reason?: string
) {
  try {
    if (!userId) {
      return { success: false, error: "Target user parameter reference identifier is required." };
    }

    const user =
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          status:
            UserStatus.REJECTED,
          approvalNote:
            reason,
        },
      });

    await prisma.approvalRequest.upsert(
      {
        where: {
          userId,
        },
        update: {
          status:
            ApprovalStatus.REJECTED,
          note:
            reason,
          reviewedAt:
            new Date(),
        },
        create: {
          userId,
          status:
            ApprovalStatus.REJECTED,
          note:
            reason,
          reviewedAt:
            new Date(),
        },
      }
    );

    // Background notifications execution wrapped carefully to avoid full workflow blockages
    try {
      await sendRejectionEmail(user.email);
    } catch (mailError) {
      console.error("Non-blocking email delivery failure during user rejection:", mailError);
    }

    try {
      await logUserBlocked(
        user.id,
        {
          email:
            user.email,
          blocked:
            true,
          reason,
        }
      );
    } catch (logError) {
      console.error("Non-blocking audit registration logging failed:", logError);
    }

    return {
      success: true,
      userId:
        user.id,
    };
  } catch (error) {
    return handleApprovalServerError(error, "Failed to complete account rejection lifecycle execution flow.");
  }
}

export async function getPendingApprovals() {
  try {
    const data = await prisma.approvalRequest.findMany(
      {
        where: {
          status:
            ApprovalStatus.PENDING,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt:
            "desc",
        },
      }
    );
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch pending requests grid channel:", error);
    return { 
      success: false, 
      error: "Could not fetch dynamic pending approval records feed context.", 
      data: [] 
    };
  }
}

export async function getApprovalRequests() {
  try {
    const data = await prisma.approvalRequest.findMany(
      {
        include: {
          user: true,
        },
        orderBy: {
          createdAt:
            "desc",
        },
      }
    );
    return { success: true, data };
  } catch (error) {
    console.error("Failed to query full historical approval registries:", error);
    return { 
      success: false, 
      error: "Could not fetch chronological tracking request records.", 
      data: [] 
    };
  }
}

export async function getApprovalRequest(
  userId: string
) {
  try {
    if (!userId) return { success: true, data: null };

    const data = await prisma.approvalRequest.findUnique(
      {
        where: {
          userId,
        },
        include: {
          user: true,
        },
      }
    );
    return { success: true, data };
  } catch (error) {
    return handleApprovalServerError(error, "Failed to retrieve specified context mapping profile relationship verification record.");
  }
}