import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function handleResetVerifyRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Password Reset Verification API Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed request payload layout format streams." },
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
          "The identity verification database is currently busy processing secure queues. Please re-enter your new credentials.",
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
      return handleResetVerifyRouteError(
        jsonError,
        "Failed to parse password mutation data packet streams.",
        400
      );
    }

    const { email, token, password } = body;

    if (!email || !token || !password) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Validation failed: Explicit email address, 6-digit OTP, and a fresh password string are required.",
        },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanToken = String(token).trim();

    let resetToken;
    try {
      resetToken = await prisma.passwordResetToken.findFirst({
        where: {
          email: cleanEmail,
          token: cleanToken,
        },
      });
    } catch (dbError) {
      return handleResetVerifyRouteError(
        dbError,
        "Failed to query system verification codes ledger."
      );
    }

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: "The verification code (OTP) entered is incorrect, invalid, or has expired.",
        },
        { status: 400 }
      );
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (hashError) {
      return handleResetVerifyRouteError(
        hashError,
        "The security layer failed encrypting your authentication credentials payload."
      );
    }

    try {
      await prisma.$transaction([
        prisma.user.update({
          where: { email: cleanEmail },
          data: { password: hashedPassword },
        }),
        prisma.passwordResetToken.delete({
          where: { id: resetToken.id },
        }),
      ]);
    } catch (dbTxError) {
      return handleResetVerifyRouteError(
        dbTxError,
        "Failed finalizing password rewrite rules inside the core schema engine."
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (globalCatchError) {
    return handleResetVerifyRouteError(
      globalCatchError,
      "The password update validation pipeline encountered an unhandled execution core thread break."
    );
  }
}
