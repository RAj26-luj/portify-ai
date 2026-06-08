import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/rate-limit";

import { extractPdfText } from "@/services/resume";
import { parseResumeWithAI } from "@/services/resume/parser";

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

    const result =
      await parseResumeWithAI(
        text
      );

    return NextResponse.json(
      {
        success: true,
        data: result,
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