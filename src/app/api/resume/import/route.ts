import { NextResponse } from "next/server";

import { importResume } from "@/actions/resume-import";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    await importResume(
      body.portfolioId,
      body.data
    );

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}