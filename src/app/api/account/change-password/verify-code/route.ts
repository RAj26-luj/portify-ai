import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

function handleChallengeVerifyRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Change Password Challenge Verification API Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed request payload configuration metrics data format." },
      { status: 400 }
    );
  }
  if (
    errorMessage.includes("cookie") ||
    errorMessage.includes("header") ||
    errorMessage.includes("Store")
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "The identity verification security context could not read system storage links. Retry.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: false, error: fallbackMessage }, { status });
}

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return handleChallengeVerifyRouteError(
        jsonError,
        "Failed decoding authentication check packet configurations.",
        400
      );
    }

    const code = body?.code?.toString().trim();

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed: The 6-digit challenge token parameter field is required.",
        },
        { status: 400 }
      );
    }

    let cookieStore;
    try {
      cookieStore = await cookies();
    } catch (storeError) {
      return handleChallengeVerifyRouteError(
        storeError,
        "Failed accessing system cookie security layer."
      );
    }

    const storedCode = cookieStore.get("change_password_code")?.value;

    if (!storedCode) {
      return NextResponse.json(
        {
          success: false,
          error: "The verification window expired. Please request a fresh code to your inbox.",
        },
        { status: 400 }
      );
    }

    if (storedCode !== code) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The security token mismatch: The verification code entered is completely invalid.",
        },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Security code identity verification check completed successfully.",
    });

    try {
      response.cookies.set("change_password_verified", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 60,
        path: "/",
      });
    } catch (cookieSetError) {
      return handleChallengeVerifyRouteError(
        cookieSetError,
        "The verification engine failed updating security state tokens on the browser."
      );
    }

    return response;
  } catch (globalCatchError) {
    return handleChallengeVerifyRouteError(
      globalCatchError,
      "The challenge authorization verification pipeline encountered an unhandled core exception."
    );
  }
}
