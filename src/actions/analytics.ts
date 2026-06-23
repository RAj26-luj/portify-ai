"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPortfolioId } from "@/lib/get-portfolio-id";

// Error
function handleAnalyticsServerError(error: any, fallbackMessage: string) {
  console.error("Analytics Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return {
      success: false,
      error: "The analytical data sync failed. Database logging engine is temporarily busy.",
    };
  }
  return { success: false, error: fallbackMessage };
}

export async function recordView(portfolioId: string, data?: { visitorHash?: string }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const resolvedPortfolioId =
      portfolioId ||
      (
        await prisma.user.findUnique({
          where: { id: userId },
          select: { portfolio: { select: { id: true } } },
        })
      )?.portfolio?.id;

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Identification target profile could not be verified to log metrics.",
      };
    }

    await prisma.analytics.update({
      where: {
        portfolioId: resolvedPortfolioId,
      },
      data: {
        totalViews: {
          increment: 1,
        },
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    return handleAnalyticsServerError(error, "Failed to capture portfolio visitation statistics.");
  }
}

export async function getAnalytics(portfolioId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: true,
        data: {
          totalViews: 0,
          uniqueVisitors: 0,
          resumeDownloads: 0,
          contactRequests: 0,
          projectClicks: 0,
          recentViews: [],
        },
      };
    }

    const analytics = await prisma.analytics.findUnique({
      where: {
        portfolioId: resolvedPortfolioId,
      },
    });

    const [messages, resumeDownloads, projectClicks] = await Promise.all([
      prisma.contactMessage.count({
        where: {
          portfolioId: resolvedPortfolioId,
        },
      }),

      prisma.resumeDownload.count({
        where: {
          portfolioId: resolvedPortfolioId,
        },
      }),

      prisma.projectClick.count({
        where: {
          portfolioId: resolvedPortfolioId,
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalViews: analytics?.totalViews ?? 0,
        uniqueVisitors: analytics?.uniqueVisitors ?? 0,
        resumeDownloads: analytics?.resumeDownloads ?? resumeDownloads,
        contactRequests: analytics?.contactRequests ?? messages,
        projectClicks: analytics?.projectClicks ?? projectClicks,
        recentViews: [],
      },
    };
  } catch (error) {
    console.error("Failed to load historical charts insight metrics:", error);
    return {
      success: false,
      error: "Unable to aggregate traffic logs dashboard. Please pull to refresh dashboard.",
      data: {
        totalViews: 0,
        uniqueVisitors: 0,
        resumeDownloads: 0,
        contactRequests: 0,
        projectClicks: 0,
        recentViews: [],
      },
    };
  }
}

export async function trackProjectClick(portfolioId: string, projectId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const resolvedPortfolioId =
      portfolioId ||
      (
        await prisma.user.findUnique({
          where: { id: userId },
          select: { portfolio: { select: { id: true } } },
        })
      )?.portfolio?.id;

    if (!resolvedPortfolioId || !projectId) {
      return {
        success: false,
        error: "Required tracking targets missing. Click registration abort.",
      };
    }

    await prisma.projectClick.create({
      data: {
        portfolioId: resolvedPortfolioId,
        projectId,
      },
    });

    await prisma.analytics.upsert({
      where: {
        portfolioId: resolvedPortfolioId,
      },
      update: {
        projectClicks: {
          increment: 1,
        },
      },
      create: {
        portfolioId: resolvedPortfolioId,
        totalViews: 0,
        uniqueVisitors: 0,
        resumeDownloads: 0,
        contactRequests: 0,
        projectClicks: 1,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    return handleAnalyticsServerError(
      error,
      "Failed to compile background interaction click records."
    );
  }
}

export async function getPortfolioStats(portfolioId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: true,
        data: {
          totalViews: 0,
          uniqueVisitors: 0,
          resumeDownloads: 0,
          contactRequests: 0,
          projectClicks: 0,
        },
      };
    }

    const analytics = await prisma.analytics.findUnique({
      where: {
        portfolioId: resolvedPortfolioId,
      },
    });

    return {
      success: true,
      data: {
        totalViews: analytics?.totalViews ?? 0,
        uniqueVisitors: analytics?.uniqueVisitors ?? 0,
        resumeDownloads: analytics?.resumeDownloads ?? 0,
        contactRequests: analytics?.contactRequests ?? 0,
        projectClicks: analytics?.projectClicks ?? 0,
      },
    };
  } catch (error) {
    console.error("Failed to query baseline counters stream stats:", error);
    return {
      success: false,
      error: "Could not fetch platform performance overview records counter grid.",
      data: {
        totalViews: 0,
        uniqueVisitors: 0,
        resumeDownloads: 0,
        contactRequests: 0,
        projectClicks: 0,
      },
    };
  }
}
