import { NextResponse } from "next/server";
import { registerUser } from "@/actions/auth";

function handleRegisterRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Account Creation API Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed request payload layout data packet parameters format." },
      { status: 400 }
    );
  }
  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "The account directory engine is temporarily busy optimizing system data pools. Please submit again.",
      },
      { status: 503 }
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
      return handleRegisterRouteError(
        jsonError,
        "Failed decoding authentication extraction parameters.",
        400
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Validation failed: Request payload context must be a valid structured data object.",
        },
        { status: 400 }
      );
    }

    let result;
    try {
      result = await registerUser(body);
    } catch (serviceError) {
      return handleRegisterRouteError(
        serviceError,
        "The authentication layer encountered an error processing your registration parameters."
      );
    }

    if (!result || typeof result !== "object" || !("success" in result)) {
      return NextResponse.json(
        {
          success: false,
          error: "The core registration process returned an invalid system response signature.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (globalCatchError) {
    return handleRegisterRouteError(
      globalCatchError,
      "The user registration pipeline encountered an unhandled execution core thread break."
    );
  }
}
