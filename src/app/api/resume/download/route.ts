import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function handleResumeDownloadError(error: any, fallbackMessage: string, status = 500) {
  console.error("Resume Delivery & Analytics Subsystem Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "The file delivery layout is temporarily busy performing background tracking logs. Please download again.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ success: false, error: fallbackMessage }, { status });
}

export async function GET(req: Request) {
  try {
    let username;
    try {
      const { searchParams } = new URL(req.url);
      username = searchParams.get("username");
    } catch (urlError) {
      return handleResumeDownloadError(
        urlError,
        "Malformed gateway download path routing parameters structure.",
        400
      );
    }

    if (!username || username.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Tracking constraint mismatch: Explicit 'username' target parameter argument is required.",
        },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).toLowerCase().trim();

    let portfolio;
    try {
      portfolio = await prisma.portfolio.findUnique({
        where: { username: cleanUsername },
        include: { resume: true },
      });
    } catch (dbError) {
      return handleResumeDownloadError(
        dbError,
        "Failed mapping account assets configuration metrics logs."
      );
    }

    if (!portfolio || !portfolio.resume || !portfolio.resume.fileUrl) {
      return NextResponse.json(
        {
          success: false,
          error: `Asset tracking failed: No active downloadable document found matching target account '${cleanUsername}'.`,
        },
        { status: 404 }
      );
    }

    try {
      await prisma.$transaction([
        prisma.resumeDownload.create({
          data: { portfolioId: portfolio.id },
        }),
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
      console.error(
        "Non-blocking analytical metrics accumulation pipeline timeout exception:",
        txError
      );
    }

    const rawTargetFileUrl = portfolio.resume.fileUrl;
    let absoluteRedirectDestination: URL;

    try {
      if (rawTargetFileUrl.startsWith("http://") || rawTargetFileUrl.startsWith("https://")) {
        absoluteRedirectDestination = new URL(rawTargetFileUrl);
      } else {
        const hostOriginContext = req.headers.get("origin") || req.headers.get("host");
        const standardBaseProtocol = hostOriginContext?.includes("localhost")
          ? "http://"
          : "https://";

        const cleanOrigin = hostOriginContext?.replace(/^https?:\/\//, "") || "localhost:3000";
        const cleanPathPrefix = rawTargetFileUrl.startsWith("/")
          ? rawTargetFileUrl
          : `/${rawTargetFileUrl}`;

        absoluteRedirectDestination = new URL(
          `${standardBaseProtocol}${cleanOrigin}${cleanPathPrefix}`
        );
      }
    } catch (urlBuildError) {
      console.error("Redirect vector construction error:", urlBuildError);
      return NextResponse.json(
        {
          success: false,
          error:
            "The document storage link parameter structure has an unparseable format tracking rule.",
        },
        { status: 422 }
      );
    }

    return NextResponse.redirect(absoluteRedirectDestination.toString());
  } catch (globalCatchError) {
    return handleResumeDownloadError(
      globalCatchError,
      "The asset download distribution manager hit an unhandled thread crash."
    );
  }
}
