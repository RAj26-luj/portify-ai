import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function handleAuthCheckRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Auth User Check API Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed check parameters matrix payload." },
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
          "The profile directory engine is temporarily busy running routine syncs. Please try again.",
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
      return handleAuthCheckRouteError(
        jsonError,
        "Failed to parse incoming tracking data packet layouts.",
        400
      );
    }

    const { email } = body;

    if (!email || String(email).trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "An email address parameter is required to perform account lookups.",
        },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).toLowerCase().trim();

    let user;
    try {
      user = await prisma.user.findUnique({
        where: {
          email: cleanEmail,
        },
      });
    } catch (dbError) {
      return handleAuthCheckRouteError(
        dbError,
        "The validation network timed out verifying account availability attributes."
      );
    }

    return NextResponse.json({
      success: true,
      exists: !!user,
    });
  } catch (globalCatchError) {
    return handleAuthCheckRouteError(
      globalCatchError,
      "The internal registration routing layer encountered an unhandled exception block."
    );
  }
}
