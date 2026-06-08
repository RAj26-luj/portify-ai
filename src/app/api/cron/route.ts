import { NextResponse } from "next/server";

import {
  runCleanupJobs,
} from "@/jobs/cleanup";

export async function GET(
  req: Request
) {
  const auth =
    req.headers.get(
      "authorization"
    );

  const secret =
    process.env.CRON_SECRET;
if (!secret) {
  return NextResponse.json(
    {
      success: false,
      error:
        "CRON_SECRET not configured",
    },
    {
      status: 500,
    }
  );
}

  if (
    secret &&
    auth !==
      `Bearer ${secret}`
  ) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 401,
      }
    );
  }

  const result =
    await runCleanupJobs();

  return NextResponse.json({
    success: true,
    data: result,
  });
}