"use server";

import { prisma } from "@/lib/prisma";
import {
  PortfolioStatus,
  UserRole,
  UserStatus,
} from "@prisma/client";

/**
 * Standard server exception handler translating internal infrastructure errors
 * into structured consumer-friendly notifications to ensure client resilience.
 */
function handleAdminServerError(
  error: any,
  fallbackMessage: string
): {
  success: false;
  error: string;
} {
  console.error("Admin Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return { 
      success: false, 
      error: "Database management system is currently unavailable. Please verify connection strings." 
    };
  }
  if (errorMessage.includes("unauthorized") || errorMessage.includes("denied")) {
    return { 
      success: false, 
      error: "Access denied. Your current session does not hold structural administrative privileges." 
    };
  }
  
  return { success: false, error: fallbackMessage };
}

export async function getPendingUsers() {
  try {
    const data = await prisma.user.findMany({
      where: {
        status: UserStatus.PENDING,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        portfolio: {
          select: {
            id: true,
            username: true,
            title: true,
            category: true,
            publishReady: true,
          },
        },
        approvalRequest: true,
      },
    });
    return { success: true, data };
  } catch (error) {
    return handleAdminServerError(error, "Failed to load pending users directory list.");
  }
}

export async function getAllUsers() {
  try {
    const data = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        portfolio: {
          select: {
            id: true,
            username: true,
            title: true,
            status: true,
            category: true,
            publishReady: true,
          },
        },
        approvalRequest: true,
        _count: {
          select: {
            notifications: true,
            auditLogs: true,
            emailLogs: true,
          },
        },
      },
    });
    return { success: true, data };
  } catch (error) {
    return handleAdminServerError(error, "Failed to aggregate complete administrative users record system.");
  }
}

export async function getUserStats() {
  try {
    const [
      totalUsers,
      pendingUsers,
      approvedUsers,
      rejectedUsers,
      blockedUsers,
      adminUsers,
      totalPortfolios,
      publishedPortfolios,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          status: UserStatus.PENDING,
        },
      }),

      prisma.user.count({
        where: {
          status: UserStatus.APPROVED,
        },
      }),

      prisma.user.count({
        where: {
          status: UserStatus.REJECTED,
        },
      }),

      prisma.user.count({
        where: {
          isBlocked: true,
        },
      }),

      prisma.user.count({
        where: {
          role: UserRole.ADMIN,
        },
      }),

      prisma.portfolio.count(),

      prisma.portfolio.count({
        where: {
          status: PortfolioStatus.PUBLISHED,
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        pendingUsers,
        approvedUsers,
        rejectedUsers,
        blockedUsers,
        adminUsers,
        totalPortfolios,
        publishedPortfolios,
      }
    };
  } catch (error) {
    return handleAdminServerError(error, "Failed to parse system registration and metric counters.");
  }
}

export async function getUserById(userId: string) {
  try {
    if (!userId) {
      return { success: false, error: "User specification profile ID parameter is missing." };
    }

    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        portfolio: {
          include: {
            analytics: true,
          },
        },
        approvalRequest: true,
        notifications: {
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
        },
        auditLogs: {
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
        },
        emailLogs: {
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
        },
      },
    });
    return { success: true, data };
  } catch (error) {
    return handleAdminServerError(error, "Failed to track specific profile data log feed history.");
  }
}

export async function getPlatformStats() {
  try {
    const [
      totalUsers,
      totalPortfolios,
      publishedPortfolios,
      totalProjects,
      totalMessages,
      totalReports,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.portfolio.count(),

      prisma.portfolio.count({
        where: {
          status: PortfolioStatus.PUBLISHED,
        },
      }),

      prisma.project.count(),

      prisma.contactMessage.count(),

      prisma.report.count(),
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        totalPortfolios,
        publishedPortfolios,
        totalProjects,
        totalMessages,
        totalReports,
      }
    };
  } catch (error) {
    return handleAdminServerError(error, "Failed to compile cross-platform global data analytics.");
  }
}