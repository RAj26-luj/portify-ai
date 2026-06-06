import { NextResponse } from "next/server";

import { extractPdfText } from "@/services/resume";
import { parseResumeWithAI } from "@/services/resume/parser";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const text =
      await extractPdfText(
        Buffer.from(
          body.buffer,
          "base64"
        )
      );

    const result =
      await parseResumeWithAI(
        text
      );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
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