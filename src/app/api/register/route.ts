import { NextResponse } from "next/server";
import { registerUser } from "@/actions/auth";

/**
 * Transforms user registration failures, payload anomalies, or service layer timeouts
 * into uniform HTTP JSON responses optimized for onboarding form feedback loops.
 */
function handleRegisterRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Account Creation API Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed request payload layout data packet streams." },
      { status: 400 }
    );
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return NextResponse.json(
      { success: false, error: "The account directory engine is temporarily busy optimizing system data pools. Please submit again." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status }
  );
}

export async function POST(req: Request) {
  try {
    // 1. Safe JSON body parsing checkpoint
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return handleRegisterRouteError(jsonError, "Failed decoding authentication extraction parameters.", 400);
    }

    // 2. Pre-flight structural body integrity guard
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Validation failed: Request payload context must be a valid structured data object." },
        { status: 400 }
      );
    }

    // 3. Delegate execution directly to the validation-heavy Auth Service layer
    let result;
    try {
      result = await registerUser(body);
    } catch (serviceError) {
      return handleRegisterRouteError(serviceError, "The authentication layer encountered an error processing your registration parameters.");
    }

    // 4. Evaluate service execution results contract cleanly
    if (!result || typeof result !== "object" || !("success" in result)) {
      return NextResponse.json(
        { success: false, error: "The core registration process returned an invalid system response signature." },
        { status: 500 }
      );
    }

    // 5. Match explicit status codes back to UI depending on custom schema outputs
    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });

  } catch (globalCatchError) {
    return handleRegisterRouteError(globalCatchError, "The user registration pipeline encountered an unhandled execution core thread break.");
  }
}