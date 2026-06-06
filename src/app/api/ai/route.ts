import { NextResponse } from "next/server";

import {
  improveBio,
  generateProjectDescription,
  parseResumeText,
} from "@/services/ai";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const { action } = body;

    switch (action) {
      case "improve-bio": {
        const result =
          await improveBio(
            body.bio ?? ""
          );

        return NextResponse.json({
          success: true,
          result,
        });
      }

      case "project-description": {
        const result =
          await generateProjectDescription(
            body.title ?? "",
            body.techStack ?? []
          );

        return NextResponse.json({
          success: true,
          result,
        });
      }

      case "parse-resume": {
        const result =
          await parseResumeText(
            body.text ?? ""
          );

        return NextResponse.json({
          success: true,
          result,
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action",
          },
          {
            status: 400,
          }
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}