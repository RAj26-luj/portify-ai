import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { trackResumeDownload } from "@/actions/resume";

export async function GET(
  req: Request
) {
  const { searchParams } =
    new URL(req.url);

  const portfolioId =
    searchParams.get(
      "portfolioId"
    );

  if (!portfolioId) {
    return NextResponse.json(
      {
        error:
          "Portfolio not found",
      },
      {
        status: 404,
      }
    );
  }

  const resume =
    await prisma.resume.findUnique({
      where: {
        portfolioId,
      },
    });

  if (!resume) {
    return NextResponse.json(
      {
        error:
          "Resume not found",
      },
      {
        status: 404,
      }
    );
  }

  await trackResumeDownload(
    portfolioId
  );

  return NextResponse.redirect(
    resume.fileUrl
  );
}