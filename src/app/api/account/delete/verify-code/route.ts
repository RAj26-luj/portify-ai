import { NextRequest, NextResponse } from "next/server";

/**
 * Transforms missing body tokens, cookie parsing anomalies, verification timeouts,
 * or validation structural drops into uniform JSON API contract response footprints.
 */
function handleDestructionCheckRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Account Removal Challenge Code Verification Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed check parameters metadata or corrupted identity tracking token format rules." },
      { status: 400 }
    );
  }
  if (errorMessage.includes("cookie") || errorMessage.includes("header")) {
    return NextResponse.json(
      { success: false, error: "Security context modification rejected. Failed reading verification snapshot logs." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status }
  );
}

export async function POST(request: NextRequest) {
  try {
    // 1. Safe JSON request body parsing checkpoint
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      return handleDestructionCheckRouteError(jsonError, "Failed decoding authentication verification packet data vectors.", 400);
    }

    const { code } = body;

    // 2. Pre-flight parameter verification guard
    if (!code || String(code).trim() === "") {
      return NextResponse.json(
        { success: false, error: "Validation failed: The 6-digit verification code parameter is required." },
        { status: 400 }
      );
    }

    // 3. Resolve context tracking verification challenge cookie reference
    const cookie = request.cookies.get("delete-account-code");

    if (!cookie?.value) {
      return NextResponse.json(
        { success: false, error: "The account clearance window has completely expired or no verification log was found." },
        { status: 400 }
      );
    }

    // 4. Secure challenge payload string decryption tracking layout lookup
    let data;
    try {
      data = JSON.parse(cookie.value);
    } catch (parseError) {
      return handleDestructionCheckRouteError(parseError, "Failed parsing verification metadata configuration tracking block.", 400);
    }

    // 5. Audit temporal lifespan boundaries dynamically
    if (!data || typeof data !== "object" || !data.expiresAt || !data.code) {
      return NextResponse.json(
        { success: false, error: "The verification sequence tracking descriptor has an unparseable schema format signature." },
        { status: 400 }
      );
    }

    if (Date.now() > data.expiresAt) {
      const response = NextResponse.json(
        { success: false, error: "The verification code security lifespan has expired. Please request a fresh email token code." },
        { status: 400 }
      );

      // Clean up stale parameters mapping rows directly on client browsers
      try {
        response.cookies.delete("delete-account-code");
      } catch (cookieClearError) {
        console.error("Non-blocking failure dropping expired security tokens:", cookieClearError);
      }

      return response;
    }

    // 6. Enforce strict parameter balancing matching verification check
    if (String(code).trim() !== String(data.code).trim()) {
      return NextResponse.json(
        { success: false, error: "Security validation token mismatch: The verification code typed is completely invalid." },
        { status: 400 }
      );
    }

    // 7. Initialize successful execution payload response template
    const response = NextResponse.json({
      success: true,
      verified: true,
      message: "Security clearance confirmation level verified successfully. You may proceed to data wiping routines.",
    });

    // 8. Inject secure tracking credential cookies to unlock final DELETE endpoints pathways
    try {
      response.cookies.set("delete-account-verified", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10, // Maintained exact 10 minutes validation lifespan match configuration
      });
    } catch (cookieSetError) {
      return handleDestructionCheckRouteError(cookieSetError, "The verification engine failed initializing secure authorization state tokens.");
    }

    // 9. Fire verified clearance token back onto wizard form steps views
    return response;

  } catch (globalCatchError) {
    return handleDestructionCheckRouteError(globalCatchError, "The challenge validation processing gateway encountered an unhandled core exception block.");
  }
}