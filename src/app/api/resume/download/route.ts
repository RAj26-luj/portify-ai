import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Transforms query path exceptions, missing bucket assets, or analytical indexing timeouts
 * into uniform JSON responses optimized for seamless visitor layout client interaction.
 */
function handleResumeDownloadError(error: any, fallbackMessage: string, status = 500) {
  console.error("Resume Delivery & Analytics Subsystem Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return NextResponse.json(
      { success: false, error: "The file delivery layout is temporarily busy performing background tracking logs. Please download again." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status }
  );
}

export async function GET(req: Request) {
  try {
    // 1. URL search parameter extraction checkpoint
    let username;
    try {
      const { searchParams } = new URL(req.url);
      username = searchParams.get("username");
    } catch (urlError) {
      return handleResumeDownloadError(urlError, "Malformed gateway download path routing parameters structure.", 400);
    }

    // 2. Query target identifier guard
    if (!username || username.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Tracking constraint mismatch: Explicit 'username' target parameter argument is required." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).toLowerCase().trim();

    // 3. Resolve master profile layout assets records
    let portfolio;
    try {
      portfolio = await prisma.portfolio.findUnique({
        where: { username: cleanUsername },
        include: { resume: true },
      });
    } catch (dbError) {
      return handleResumeDownloadError(dbError, "Failed mapping account assets configuration metrics logs.");
    }

    if (!portfolio || !portfolio.resume || !portfolio.resume.fileUrl) {
      return NextResponse.json(
        { success: false, error: `Asset tracking failed: No active downloadable document found matching target account '${cleanUsername}'.` },
        { status: 404 }
      );
    }

    // 4. Isolated Multi-Table Analytical Increment Transaction
    try {
      await prisma.$transaction([
        // Register distinct record point down onto log lines table
        prisma.resumeDownload.create({
          data: { portfolioId: portfolio.id },
        }),
        // Upsert analytics metric summary counter matrix
        prisma.analytics.upsert({
          where: { portfolioId: portfolio.id },
          create: {
            portfolioId: portfolio.id,
            totalViews: 0,
            uniqueVisitors: 0,
            resumeDownloads: 1,
            contactRequests: 0,
            projectClicks: 0,
          },
          update: {
            resumeDownloads: { increment: 1 },
          },
        }),
      ]);
    } catch (txError) {
      // We log analytical transaction drops internally but proceed to let the applicant get the file cleanly
      console.error("Non-blocking analytical metrics accumulation pipeline timeout exception:", txError);
    }

    /**
     * 🛡️ NEXT.JS ABSOLUTE URL REDIRECT FALLBACK ENGINE
     * Evaluates string constraints to confirm if target asset points to a qualified cloud URL.
     * Prevents internal app router breaks if local storage directory routing arrays are used.
     */
    const rawTargetFileUrl = portfolio.resume.fileUrl;
    let absoluteRedirectDestination: URL;

    try {
      if (rawTargetFileUrl.startsWith("http://") || rawTargetFileUrl.startsWith("https://")) {
        absoluteRedirectDestination = new URL(rawTargetFileUrl);
      } else {
        // Build fully structured target link from local application origins baseline
        const hostOriginContext = req.headers.get("origin") || req.headers.get("host");
        const standardBaseProtocol = hostOriginContext?.includes("localhost") ? "http://" : "https://";
        
        // Assemble cleanly stripped string layouts
        const cleanOrigin = hostOriginContext?.replace(/^https?:\/\//, "") || "localhost:3000";
        const cleanPathPrefix = rawTargetFileUrl.startsWith("/") ? rawTargetFileUrl : `/${rawTargetFileUrl}`;
        
        absoluteRedirectDestination = new URL(`${standardBaseProtocol}${cleanOrigin}${cleanPathPrefix}`);
      }
    } catch (urlBuildError) {
      console.error("Redirect vector construction error:", urlBuildError);
      return NextResponse.json(
        { success: false, error: "The document storage link parameter structure has an unparseable format tracking rule." },
        { status: 422 }
      );
    }

    // 5. Fire safe absolute relocation command back to browser
    return NextResponse.redirect(absoluteRedirectDestination.toString());

  } catch (globalCatchError) {
    return handleResumeDownloadError(globalCatchError, "The asset download distribution manager hit an unhandled thread crash.");
  }
}