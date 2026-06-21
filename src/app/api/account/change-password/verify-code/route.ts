import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Transforms client verification deviations, cookie decryption lags, or payload 
 * stream failures into standard JSON payloads optimized for rendering wizard error lines.
 */
function handleChallengeVerifyRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Change Password Challenge Verification API Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed request payload configuration metrics data format." },
      { status: 400 }
    );
  }
  if (errorMessage.includes("cookie") || errorMessage.includes("header") || errorMessage.includes("Store")) {
    return NextResponse.json(
      { success: false, error: "The identity verification security context could not read system storage links. Retry." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status }
  );
}

export async function POST(req: NextRequest) {
  try {
    // 1. Safe JSON request body parsing checkpoint
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return handleChallengeVerifyRouteError(jsonError, "Failed decoding authentication check packet configurations.", 400);
    }

    const code = body?.code?.toString().trim();

    // 2. Pre-flight parameter input verification guard
    if (!code) {
      return NextResponse.json(
        { success: false, error: "Validation failed: The 6-digit challenge token parameter field is required." },
        { status: 400 }
      );
    }

    // 3. Establish async security context header cookie store link
    let cookieStore;
    try {
      cookieStore = await cookies();
    } catch (storeError) {
      return handleChallengeVerifyRouteError(storeError, "Failed accessing system cookie security layer.");
    }

    const storedCode = cookieStore.get("change_password_code")?.value;

    // 4. Audit expiration status boundaries
    if (!storedCode) {
      return NextResponse.json(
        { success: false, error: "The verification window expired. Please request a fresh code to your inbox." },
        { status: 400 }
      );
    }

    // 5. Enforce strict parameter balance matching check
    if (storedCode !== code) {
      return NextResponse.json(
        { success: false, error: "The security token mismatch: The verification code entered is completely invalid." },
        { status: 400 }
      );
    }

    // 6. Build the success context mapping response template payload
    const response = NextResponse.json({
      success: true,
      message: "Security code identity verification check completed successfully.",
    });

    try {
      /**
       * Elevate authorization access state status token parameters.
       * Unlocks permission pathways down onto subsequent password write routes.
       */
      response.cookies.set("change_password_verified", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 60, // Maintained 10 minutes verification lifespans match
        path: "/",
      });
    } catch (cookieSetError) {
      return handleChallengeVerifyRouteError(cookieSetError, "The verification engine failed updating security state tokens on the browser.");
    }

    // 7. Fire safe context-verified payload packet back to UI wizard screens
    return response;

  } catch (globalCatchError) {
    return handleChallengeVerifyRouteError(globalCatchError, "The challenge authorization verification pipeline encountered an unhandled core exception.");
  }
}