import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendDeleteAccountCodeEmail } from "@/lib/mail";

function handleDestructionOtpRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Account Destructor Challenge OTP API Route Exception:", error);
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
          "The identity verification database is currently busy. Please resubmit your code request.",
      },
      { status: 503 }
    );
  }
  if (
    errorMessage.includes("cookie") ||
    errorMessage.includes("header") ||
    errorMessage.includes("stringify")
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to initialize high-privilege verification context states on the connection browser.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: false, error: fallbackMessage }, { status });
}

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Access Denied: High-privilege authentication token signature is completely missing.",
        },
        { status: 401 }
      );
    }

    let user;
    try {
      user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });
    } catch (dbError) {
      return handleDestructionOtpRouteError(
        dbError,
        "Failed mapping user profile properties fields context configurations."
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Identity failure: No active user profile metrics line corresponds to your session data.",
        },
        { status: 404 }
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    let cookieValue: string;
    try {
      cookieValue = JSON.stringify({
        code,
        expiresAt,
        email: user.email,
      });
    } catch (jsonError) {
      return handleDestructionOtpRouteError(
        jsonError,
        "Failed encoding security challenge metadata tracking configurations."
      );
    }

    const response = NextResponse.json({
      success: true,
      message:
        "An account data clear token has been safely dispatched to your registered address inbox.",
    });

    try {
      response.cookies.set("delete-account-code", cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10,
      });
    } catch (cookieSetError) {
      return handleDestructionOtpRouteError(
        cookieSetError,
        "The engine failed setting verification security state tokens on the browser client."
      );
    }

    try {
      await sendDeleteAccountCodeEmail({
        email: user.email,
        code,
        userId: user.id,
      });
    } catch (mailError) {
      console.error("Mailing network rejected account erasure OTP dispatch package:", mailError);
      return NextResponse.json(
        {
          success: false,
          error:
            "Verification sequence initialized, but the delivery network failed to push the code. Try again.",
        },
        { status: 502 }
      );
    }

    return response;
  } catch (globalCatchError) {
    return handleDestructionOtpRouteError(
      globalCatchError,
      "The security token initialization pipeline encountered an unhandled exception block."
    );
  }
}
