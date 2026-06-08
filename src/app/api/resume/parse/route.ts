import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/rate-limit";

import { extractPdfText } from "@/services/resume";
import { parseResumeWithAI } from "@/services/resume/parser";
import {
  analyzeResume,
} from "@/services/resume/analyze";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request
) {
  try {
    const ip =
      req.headers.get(
        "x-forwarded-for"
      ) ?? "unknown";

    const limit =
      rateLimit(
        `resume-parse:${ip}`,
        10,
        60_000
      );

    if (!limit.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many requests",
        },
        {
          status: 429,
        }
      );
    }

    const body =
      await req.json();

    if (!body.buffer) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Resume file is required",
        },
        {
          status: 400,
        }
      );
    }

    const text =
      await extractPdfText(
        Buffer.from(
          body.buffer,
          "base64"
        )
      );

    if (!text.trim()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to extract resume text",
        },
        {
          status: 400,
        }
      );
    }

const parsedData =
  await parseResumeWithAI(
    text
  );

const analysis =
  analyzeResume(
    parsedData
  );
if (
  body.portfolioId
) {
  await prisma.portfolio.update({
    where: {
      id: body.portfolioId,
    },

    data: {
      completionScore:
        analysis.completionScore,

      portfolioScore:
        analysis.portfolioScore,

      pendingFields:
        analysis.missingFields,

      pendingQuestions:
        analysis.questions,

      profileCompleted:
        analysis.missingFields
          .length === 0,

      lastAnalyzedAt:
        new Date(),
    },
  });
}
return NextResponse.json(
  {
    success: true,
    data: parsedData,
    analysis,
  },
  {
    status: 200,
  }
);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Resume parsing failed",
      },
      {
        status: 500,
      }
    );
  }
}