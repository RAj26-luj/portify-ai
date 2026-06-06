import { NextResponse } from "next/server";

import {
  parseResumeText,
} from "@/services/ai";

export async function POST(
  req: Request
) {
  const body = await req.json();

  const result =
    await parseResumeText(
      body.text ?? ""
    );

  return NextResponse.json({
    result,
  });
}