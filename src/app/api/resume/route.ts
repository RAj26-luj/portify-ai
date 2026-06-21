import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getPortfolioId } from "@/lib/get-portfolio-id";

/**
 * Transforms workspace identity lookup breaks, file drop failures, or database
 * locks into standardized, user-friendly JSON payloads optimized for UI alert states.
 */
function handleResumeMetaRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Resume Configuration Metadata Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("portfolioId required") || errorMessage.includes("portfolioId not found")) {
    return NextResponse.json(
      { success: false, error: "Authentication reference missing. Could not trace workspace tracking identifiers." },
      { status: 401 }
    );
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return NextResponse.json(
      { success: false, error: "The document storage database layer is currently executing synchronization locks. Please retry shortly." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status }
  );
}

/* -------------------------------------------------------------------------- */
/* GET: FETCH RESUME ATTACHMENT REFERENCE LOGS                                */
/* -------------------------------------------------------------------------- */
export async function GET() {
  try {
    // 1. Resolve operational workspace identity context
    let portfolioId;
    try {
      portfolioId = await getPortfolioId();
    } catch (authError) {
      return handleResumeMetaRouteError(authError, "Failed validating user profile identity tracking markers.");
    }

    if (!portfolioId) {
      return NextResponse.json(
        { success: false, error: "Search query aborted: Active workspace portfolio connection target was not found." },
        { status: 404 }
      );
    }

    // 2. Query document meta records layer
    let resume;
    try {
      resume = await prisma.resume.findUnique({
        where: {
          portfolioId,
        },
      });
    } catch (dbError) {
      return handleResumeMetaRouteError(dbError, "Failed querying active attachment parameters from datastore.");
    }

    // 3. Return successful data payload layout contract signature
    return NextResponse.json({
      success: true,
      data: resume,
    });

  } catch (globalCatchError) {
    return handleResumeMetaRouteError(globalCatchError, "The asset lookup manager hit an unhandled data processing break layer.");
  }
}

/* -------------------------------------------------------------------------- */
/* DELETE: CLEAR RESUME ATTACHMENT FROM SCHEMA LOGS                            */
/* -------------------------------------------------------------------------- */
export async function DELETE() {
  try {
    // 1. Resolve operational workspace identity context
    let portfolioId;
    try {
      portfolioId = await getPortfolioId();
    } catch (authError) {
      return handleResumeMetaRouteError(authError, "Failed validating user profile deletion authority parameters.");
    }

    if (!portfolioId) {
      return NextResponse.json(
        { success: false, error: "Removal pipeline cancelled: Target active profile configuration mapping context was not found." },
        { status: 404 }
      );
    }

    // 2. Perform safe multi-row cleaning transaction sequence
    try {
      await prisma.resume.deleteMany({
        where: {
          portfolioId,
        },
      });
    } catch (dbDeleteError) {
      return handleResumeMetaRouteError(dbDeleteError, "Failed wiping reference attachment properties fields out of database cluster tables.");
    }

    // 3. Return uniform transaction success state signature
    return NextResponse.json({
      success: true,
    });

  } catch (globalCatchError) {
    return handleResumeMetaRouteError(globalCatchError, "The asset destructor framework gateway encountered an unhandled thread exception.");
  }
}