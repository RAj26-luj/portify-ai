import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendChangePasswordCodeEmail } from "@/lib/mail";

function handleChangePasswordOtpRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Change Password OTP Dispatcher API Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "The account management database is temporarily busy running checks. Please try again.",
      },
      { status: 503 }
    );
  }
  if (errorMessage.includes("cookie") || errorMessage.includes("header")) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Security context modification rejected. Failed initializing secure storage parameters.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: false, error: fallbackMessage }, { status });
}

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Access Denied: Authentication validation signature missing or expired.",
        },
        { status: 401 }
      );
    }

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
      return handleChangePasswordOtpRouteError(
        dbError,
        "Failed mapping account tracking configuration parameters."
      );
    }

    if (!user || !user.email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Identity failure: No active user workspace profile matches your session credentials.",
        },
        { status: 404 }
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const response = NextResponse.json({
      success: true,
      message: "A secure verification code has been dispatched to your registered email address.",
    });

    try {
      response.cookies.set("change_password_code", code, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 60,
        path: "/",
      });

      response.cookies.set("change_password_verified", "false", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 60,
        path: "/",
      });
    } catch (cookieError) {
      return handleChangePasswordOtpRouteError(
        cookieError,
        "Failed binding cryptographic state tokens onto client browsers."
      );
    }

    try {
      await sendChangePasswordCodeEmail({
        email: user.email,
        code,
        userId: user.id,
      });
    } catch (mailError) {
      console.error("Mailing engine rejected challenge token email dispatch package:", mailError);
      return NextResponse.json(
        {
          success: false,
          error:
            "Security operations initialized, but our mail delivery network failed to push the code. Try again.",
        },
        { status: 502 }
      );
    }

    return response;
  } catch (globalCatchError) {
    return handleChangePasswordOtpRouteError(
      globalCatchError,
      "The password modification pipeline encountered an unhandled core exception."
    );
  }
}
