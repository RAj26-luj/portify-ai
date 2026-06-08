import { NextResponse } from "next/server";

import { importResume } from "@/actions/resume-import";
import { rateLimit } from "@/lib/rate-limit";

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
        `resume-import:${ip}`,
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

    if (
      !body.portfolioId ||
      !body.data
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    await importResume(
      body.portfolioId,
      body.data
    );

    return NextResponse.json(
      {
        success: true,
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
            : "Import failed",
      },
      {
        status: 500,
      }
    );
  }
}