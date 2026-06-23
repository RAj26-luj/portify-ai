import { NextResponse } from "next/server";
import { auth, signOut } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";
import { deleteAccount } from "@/actions/delete-account";

function handleDeleteAccountRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Account Destructor Pipeline Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("SyntaxError") ||
    errorMessage.includes("JSON") ||
    errorMessage.includes("URI")
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Malformed request body parameters or data parsing cookie matrix validation failed.",
      },
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
          "The identity clearing house engine is busy executing cascading data deletion trees. Retry later.",
      },
      { status: 503 }
    );
  }
  if (errorMessage.includes("signOut") || errorMessage.includes("session")) {
    return NextResponse.json(
      {
        success: true,
        message:
          "Your account metrics were dropped successfully, but your authorization session termination timed out.",
      },
      { status: 200 }
    );
  }

  return NextResponse.json({ success: false, error: fallbackMessage }, { status });
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Access Denied: High-privilege authentication token validation signature is missing.",
        },
        { status: 401 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";

    let limit;
    try {
      limit = rateLimit(`delete-account:${ip}`, 3, 60 * 60 * 1000);
    } catch (limitError) {
      console.error("Account erasure rate limiter lookup exception:", limitError);
      limit = { success: true };
    }

    if (!limit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many consecutive destruction token checks. Connection throttled for 1 hour.",
        },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return handleDeleteAccountRouteError(
        jsonError,
        "Failed decoding confirmation parameters payload structure streams.",
        400
      );
    }

    const code = String(body.code ?? "").trim();

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed: The 6-digit verification code field parameter is required.",
        },
        { status: 400 }
      );
    }

    const rawCookies = req.headers.get("cookie") ?? "";
    const cookieMatch = rawCookies.match(/delete-account-code=([^;]+)/);

    if (!cookieMatch?.[1]) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The account modification window expired or no verification snapshot session exists.",
        },
        { status: 400 }
      );
    }

    let data;
    try {
      data = JSON.parse(decodeURIComponent(cookieMatch[1]));
    } catch (parseError) {
      return handleDeleteAccountRouteError(
        parseError,
        "Failed parsing encrypted security tracking matrix definitions block.",
        400
      );
    }

    if (!data || typeof data !== "object" || !data.expiresAt || !data.code) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The verification sequence context block tracking layout has a corrupted signature.",
        },
        { status: 400 }
      );
    }

    if (Date.now() > data.expiresAt || data.email !== session.user.email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The verification validation parameters have expired. Request a new data clear code.",
        },
        { status: 400 }
      );
    }

    if (code !== String(data.code).trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Security validation token mismatch: The verification code typed is invalid.",
        },
        { status: 400 }
      );
    }

    let result;
    try {
      result = await deleteAccount(session.user.id);
    } catch (actionError) {
      return handleDeleteAccountRouteError(
        actionError,
        "The account destructor action failed wiping linked workspace metrics records."
      );
    }

    const response = NextResponse.json(result, {
      status: 200,
    });

    try {
      response.cookies.delete("delete-account-code");
      response.cookies.delete("delete-account-verified");
    } catch (cookieClearError) {
      console.error(
        "Non-blocking failure dropping temporary security cookie streams:",
        cookieClearError
      );
    }

    try {
      await signOut({
        redirect: false,
      });
    } catch (signOutError) {
      return handleDeleteAccountRouteError(
        signOutError,
        "Failed to completely wipe identity session tracks gracefully."
      );
    }

    return response;
  } catch (globalCatchError) {
    return handleDeleteAccountRouteError(
      globalCatchError,
      "The account removal processing pipeline encountered an unhandled core threat break."
    );
  }
}
