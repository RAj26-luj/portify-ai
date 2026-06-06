import { NextResponse } from "next/server";

import { saveResume } from "@/actions/resume";

export async function POST(
  req: Request
) {
  const body = await req.json();

  const resume =
    await saveResume(
      body.portfolioId,
      body.fileName,
      body.fileUrl,
      body.fileSize
    );

  return NextResponse.json(
    resume
  );
}