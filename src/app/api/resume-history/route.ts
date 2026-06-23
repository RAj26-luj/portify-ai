import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getPortfolioId } from "@/lib/get-portfolio-id";

function handleResumeHistoryRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Resume Historical Versions Engine Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("portfolioId required") ||
    errorMessage.includes("portfolioId not found")
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Authentication reference token missing. Could not establish workspace tracking indices.",
      },
      { status: 401 }
    );
  }
  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "The archival data layer is temporarily running schema adjustments. Please fetch history again.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ success: false, error: fallbackMessage }, { status });
}

export async function GET() {
  try {
    let portfolioId;
    try {
      portfolioId = await getPortfolioId();
    } catch (authError) {
      return handleResumeHistoryRouteError(
        authError,
        "Failed validating historical access parameters context."
      );
    }

    if (!portfolioId) {
      return NextResponse.json(
        {
          success: false,
          error: "Query aborted: Active user profile target workspace identifier was not found.",
        },
        { status: 404 }
      );
    }

    let versions;
    try {
      versions = await prisma.resumeVersion.findMany({
        where: {
          portfolioId,
        },
        orderBy: {
          uploadedAt: "desc",
        },
      });
    } catch (dbError) {
      return handleResumeHistoryRouteError(
        dbError,
        "Failed compiling archived document snapshot indices from datastore layers."
      );
    }

    return NextResponse.json({
      success: true,
      data: versions,
    });
  } catch (globalCatchError) {
    return handleResumeHistoryRouteError(
      globalCatchError,
      "The chronological backup engine router hit an unhandled processing break layer."
    );
  }
}
