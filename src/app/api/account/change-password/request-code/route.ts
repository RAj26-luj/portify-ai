import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendChangePasswordCodeEmail } from "@/lib/mail";

/**
 * Transforms authentication slips, cookie allocation errors, database drops, 
 * or courier failures into uniform JSON payloads optimized for verification wizards.
 */
function handleChangePasswordOtpRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Change Password OTP Dispatcher API Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return NextResponse.json(
      { success: false, error: "The account management database is temporarily busy running checks. Please try again." },
      { status: 503 }
    );
  }
  if (errorMessage.includes("cookie") || errorMessage.includes("header")) {
    return NextResponse.json(
      { success: false, error: "Security context modification rejected. Failed initializing secure storage parameters." },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status }
  );
}

export async function POST() {
  try {
    // 1. Session Presence & Authentication Verification Guard
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Authentication validation signature missing or expired." },
        { status: 401 }
      );
    }

    // 2. Resolve Master User Profiles Record
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
        },
      });
    } catch (dbError) {
      return handleChangePasswordOtpRouteError(dbError, "Failed mapping account tracking configuration parameters.");
    }

    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, error: "Identity failure: No active user workspace profile matches your session credentials." },
        { status: 404 }
      );
    }

    // 3. OTP Generation Core Configuration
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Initializing Base HTTP Cookie Response Template Layer
    const response = NextResponse.json({
      success: true,
      message: "A secure verification code has been dispatched to your registered email address.",
    });

    try {
      // Set secure raw challenge token code parameters string
      response.cookies.set("change_password_code", code, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 60, // 10 minutes session lifespan configuration window
        path: "/",
      });

      // Initialize challenge status validation flag tracker
      response.cookies.set("change_password_verified", "false", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 60, // 10 minutes session lifespan configuration window
        path: "/",
      });
    } catch (cookieError) {
      return handleChangePasswordOtpRouteError(cookieError, "Failed binding cryptographic state tokens onto client browsers.");
    }

    // 5. Outbound Delivery Channel Integration
    try {
      await sendChangePasswordCodeEmail({
        email: user.email,
        code,
        userId: user.id,
      });
    } catch (mailError) {
      console.error("Mailing engine rejected challenge token email dispatch package:", mailError);
      return NextResponse.json(
        { success: false, error: "Security operations initialized, but our mail delivery network failed to push the code. Try again." },
        { status: 502 }
      );
    }

    // 6. Return standard success execution signature with headers
    return response;

  } catch (globalCatchError) {
    return handleChangePasswordOtpRouteError(globalCatchError, "The password modification pipeline encountered an unhandled core exception.");
  }
}