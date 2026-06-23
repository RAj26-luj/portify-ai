import { NextResponse } from "next/server";
import { improveBio, parseResumeText } from "@/services/ai";

function handleApiRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("AI Services API Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      {
        success: false,
        error: "Malformed request payload template. Unable to parse payload maps stream.",
      },
      { status: 400 }
    );
  }
  if (
    errorMessage.includes("rate limit") ||
    errorMessage.includes("quota") ||
    errorMessage.includes("429")
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "AI intelligence layer is temporarily throttled. Please try again in a moment.",
      },
      { status: 429 }
    );
  }

  return NextResponse.json({ success: false, error: fallbackMessage }, { status });
}

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return handleApiRouteError(
        jsonError,
        "Failed to decode incoming streaming packet data mapping blocks.",
        400
      );
    }

    const { action } = body;

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Execution operation identifier missing. The field 'action' parameter is required.",
        },
        { status: 400 }
      );
    }

    let result: any;

    switch (action) {
      case "improve-bio": {
        if (!body.bio || body.bio.trim() === "") {
          return NextResponse.json(
            {
              success: false,
              error: "Validation failed: Existing bio text string parameter context is missing.",
            },
            { status: 400 }
          );
        }
        try {
          result = await improveBio(body.bio);
        } catch (aiError) {
          return handleApiRouteError(
            aiError,
            "The optimization model failed refining the personal branding copy."
          );
        }
        break;
      }

      case "project-description": {
        if (!body.title || body.title.trim() === "") {
          return NextResponse.json(
            {
              success: false,
              error: "Validation failed: Project title or metric descriptor string is required.",
            },
            { status: 400 }
          );
        }
        try {
          result = await improveBio(body.title);
        } catch (aiError) {
          return handleApiRouteError(
            aiError,
            "The intelligence layer failed expanding the project engineering description."
          );
        }
        break;
      }

      case "parse-resume": {
        if (!body.text || body.text.trim() === "") {
          return NextResponse.json(
            {
              success: false,
              error:
                "Validation failed: Raw unformatted resume document plain-text string is required.",
            },
            { status: 400 }
          );
        }
        try {
          result = await parseResumeText(body.text);
        } catch (aiError) {
          return handleApiRouteError(
            aiError,
            "The cognitive model failed formatting the unstructured text matrix blocks."
          );
        }
        break;
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Invalid operation: The action code '${action}' is not configured on this route service mapping.`,
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (globalCatchError) {
    return handleApiRouteError(
      globalCatchError,
      "The internal route processing gateway encountered an unhandled core thread failure."
    );
  }
}
