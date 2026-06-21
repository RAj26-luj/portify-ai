import { NextResponse } from "next/server";

import { auth } from "@/auth";

import { importResumeAction } from "@/actions/resume-import";
import { getPortfolioByUserId } from "@/actions/portfolio";

import { rateLimit } from "@/lib/rate-limit";

/**
 * Transforms session access violations, cross-account resource leaks, rate limit blockades, 
 * or resume text parsing exceptions into standardized JSON HTTP response payloads.
 */
function handleResumeImportRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("AI Resume Multi-Layer Parsing Import Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed request payload layout configuration constraints format." },
      { status: 400 }
    );
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return NextResponse.json(
      { success: false, error: "The resume schema ingestion pipeline is performing routine cluster modifications. Please import again." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status }
  );
}

export async function POST(req: Request) {
  try {
    // 1. Session Presence & Authentication Verification Guard
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication validation missing: Active user identification signature is required." },
        { status: 401 }
      );
    }

    // 2. Network Identity Extraction & Rate Limiting Guard
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    
    let limit;
    try {
      limit = rateLimit(`resume-import:${ip}`, 10, 60_000);
    } catch (limitError) {
      console.error("Ingestion rate-limiter check exception:", limitError);
      limit = { success: true }; // Safe pass failguard sandbox boundary
    }

    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: "Too many consecutive file parsing updates sent from your connection. Please retry in a minute." },
        { status: 429 }
      );
    }

    // 3. Safe Request Body Extraction
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return handleResumeImportRouteError(jsonError, "Failed decoding streaming payload structural parameters format layout rules.", 400);
    }

    const { portfolioId, resume, fileName, fileUrl } = body;

    // 4. Input Validity Check
    if (!portfolioId || !resume) {
      return NextResponse.json(
        { success: false, error: "Validation failed: Missing structural portfolio tracking target index or raw data text parameter metrics." },
        { status: 400 }
      );
    }

    // 5. Cross-Account Security Lookup Layer (Prevents IDOR Parameter Overrides)
    let portfolio;
    try {
      portfolio = await getPortfolioByUserId(session.user.id);
    } catch (lookupError) {
      return handleResumeImportRouteError(lookupError, "The optimization engine failed to map your active profile structural configurations.");
    }

if (!portfolio.success || !portfolio.data) {
  return NextResponse.json(
    { success: false, error: "Portfolio not found." },
    { status: 404 }
  );
}

if (portfolio.data.id !== portfolioId) {
  return NextResponse.json(
    { success: false, error: "Access Denied: The target profile identifier parameters do not line up with the authenticated profile account." },
    { status: 403 }
  );
}

    // 6. Delegate Ingestion Task to Core Action Handler
    let result;
    try {
      result = await importResumeAction(portfolioId, resume, fileName, fileUrl);
    } catch (actionError) {
      return handleResumeImportRouteError(actionError, "The intelligence parsing model failed converting unformatted layout blocks back to schema structures.");
    }

    // 7. Success Payload Contract Signature Response
    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );

  } catch (globalCatchError) {
    return handleResumeImportRouteError(globalCatchError, "The file upload mapping gateway encountered an unhandled execution core thread break.");
  }
}