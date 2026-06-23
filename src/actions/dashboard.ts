"use server";

import { getProfile } from "@/services/user";
import { getPortfolioStats } from "@/actions/analytics";
import { getPortfolioId } from "@/lib/get-portfolio-id";
import { prisma } from "@/lib/prisma";

// Error
function handleDashboardServerError(error: any, fallbackMessage: string) {
  console.error("Dashboard Aggregator Service Server Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return {
      success: false,
      error:
        "Dashboard stats aggregator timed out. Core storage system is doing structural updates.",
    };
  }
  return { success: false, error: fallbackMessage };
}

export async function loadDashboard(username: string) {
  try {
    if (!username) {
      return {
        success: false,
        error: "Profile identifier parameter missing. Cannot aggregate dashboard data streams.",
        data: {
          user: null,
          portfolio: null,
          analytics: null,
          unreadMessages: 0,
        },
      };
    }

    const user = await getProfile(username);

    if (!user) {
      return {
        success: true,
        data: {
          user: null,
          portfolio: null,
          analytics: null,
          unreadMessages: 0,
        },
      };
    }

    const portfolioId = user.portfolio?.id || (await getPortfolioId());

    let analytics = null;
    if (portfolioId) {
      try {
        const statsResponse = await getPortfolioStats(portfolioId);
        analytics =
          statsResponse && "success" in statsResponse && statsResponse.success
            ? (statsResponse as any).data
            : statsResponse;
      } catch (analyticsError) {
        console.error(
          "Non-blocking analytics tracking load exception within aggregator loop:",
          analyticsError
        );
      }
    }

    let unreadMessages = 0;
    if (portfolioId) {
      try {
        unreadMessages = await prisma.contactMessage.count({
          where: {
            portfolioId,
            isSeen: false,
          },
        });
      } catch (messageCountError) {
        console.error(
          "Non-blocking unread metrics query counter failed within aggregator loop:",
          messageCountError
        );
      }
    }

    return {
      success: true,
      data: {
        user,
        portfolio: user.portfolio,
        analytics,
        unreadMessages,
      },
    };
  } catch (error) {
    return {
      ...handleDashboardServerError(
        error,
        "Failed to compile background metric counters and user interface states."
      ),
      data: {
        user: null,
        portfolio: null,
        analytics: null,
        unreadMessages: 0,
      },
    };
  }
}
