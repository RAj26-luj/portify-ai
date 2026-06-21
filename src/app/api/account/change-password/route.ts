import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { auth, signOut } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";
import { changePassword } from "@/actions/change-password";

/**
 * Transforms rate limit overrides, verification status drops, mutation errors,
 * or session signout faults into uniform, predictable JSON API payloads.
 */
function handlePasswordMutationRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Password Mutation Finalization API Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed request payload configuration metrics data format." },
      { status: 400 }
    );
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return NextResponse.json(
      { success: false, error: "The identity credential ledger is currently busy processing secure queues. Please re-enter your password parameters." },
      { status: 503 }
    );
  }
  if (errorMessage.includes("signOut") || errorMessage.includes("session")) {
    return NextResponse.json(
      { success: true, logout: true, redirect: "/", message: "Password updated successfully, but session clear down-link hit a timeout. Please re-login manually." },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status }
  );
}

export async function POST(req: Request) {
  try {
    // 1. Session Presence & Authentication Verification Guard Check
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Authentication token signature missing or unauthorized." },
        { status: 401 }
      );
    }

    // 2. Multi-Header Ip Extraction & Rate Limiting Guard
    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
    
    let limit;
    try {
      limit = rateLimit(`change-password:${ip}`, 5, 15 * 60 * 1000);
    } catch (limitError) {
      console.error("Password change rate limiter subsystem exception:", limitError);
      limit = { success: true }; // Safe pass sandbox fallguard
    }

    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: "Too many mutation attempts from this connection. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    // 3. Safe Request Body Parsing Checkpoint
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return handlePasswordMutationRouteError(jsonError, "Failed decoding credential change parameter packets.", 400);
    }

    if (!body?.newPassword || String(body.newPassword).trim() === "") {
      return NextResponse.json(
        { success: false, error: "Validation failed: The new password text parameter string field is required." },
        { status: 400 }
      );
    }

    // 4. Async Security Header Cookie Store Verification Audit
    let cookieStore;
    try {
      cookieStore = await cookies();
    } catch (storeError) {
      return handlePasswordMutationRouteError(storeError, "Failed accessing system cookie security layer.");
    }

    const verifiedStatus = cookieStore.get("change_password_verified")?.value;

    if (verifiedStatus !== "true") {
      return NextResponse.json(
        { success: false, error: "Access Denied: You must complete the 6-digit OTP verification check first before changing credentials." },
        { status: 400 }
      );
    }

    // 5. Execute Downstream Core Passwords Encryption Write
    let result;
    try {
      result = await changePassword(session.user.id, body.newPassword);
    } catch (actionError) {
      return handlePasswordMutationRouteError(actionError, "The credential manager action rejected the structural changes format.");
    }

    // 6. Security Context Clean-up (Clear and consume state cookies instantly)
    try {
      cookieStore.delete("change_password_code");
      cookieStore.delete("change_password_verified");
    } catch (cookieClearError) {
      console.error("Non-blocking failure clearing challenge session tokens:", cookieClearError);
    }

    // 7. Force Auth.js Session Token Eviction
    try {
      await signOut({
        redirect: false,
      });
    } catch (signOutError) {
      return handlePasswordMutationRouteError(signOutError, "Failed invalidating old token sessions cleanly.");
    }

    // 8. Return standard execution success contract signature with directions back to login
    return NextResponse.json(
      {
        success: true,
        logout: true,
        redirect: "/",
       message:
  "message" in result
    ? result.message
    : "Your password has been successfully modified. Please log back in using your new credentials.",
      },
      { status: 200 }
    );

  } catch (globalCatchError) {
    return handlePasswordMutationRouteError(globalCatchError, "The password write execution pipeline encountered an unhandled core exception.");
  }
}