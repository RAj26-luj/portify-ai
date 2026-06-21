import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

/**
 * Transforms system credential adjustments, invalid payload structures, or cryptographic 
 * processing errors into clear HTTP JSON response payloads tailored for password reset screens.
 */
function handleResetVerifyRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Password Reset Verification API Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed request payload layout format streams." },
      { status: 400 }
    );
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return NextResponse.json(
      { success: false, error: "The identity verification database is currently busy processing secure queues. Please re-enter your new credentials." },
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
    // 1. Safe JSON extraction checkpoint
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return handleResetVerifyRouteError(jsonError, "Failed to parse password mutation data packet streams.", 400);
    }

    const { email, token, password } = body;

    // 2. Pre-flight structural parameter check
    if (!email || !token || !password) {
      return NextResponse.json(
        { success: false, error: "Validation failed: Explicit email address, 6-digit OTP, and a fresh password string are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanToken = String(token).trim();

    // 3. Token lookup and expiration audit
    let resetToken;
    try {
      resetToken = await prisma.passwordResetToken.findFirst({
        where: {
          email: cleanEmail,
          token: cleanToken,
        },
      });
    } catch (dbError) {
      return handleResetVerifyRouteError(dbError, "Failed to query system verification codes ledger.");
    }

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: "The verification code (OTP) entered is incorrect, invalid, or has expired." },
        { status: 400 }
      );
    }

    // 4. Cryptographic Hashing Layer
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (hashError) {
      return handleResetVerifyRouteError(hashError, "The security layer failed encrypting your authentication credentials payload.");
    }

    // 5. Account Mutation & Token Consumption Lifecycle
    try {
      await prisma.$transaction([
        // Update user password credentials mapping fields
        prisma.user.update({
          where: { email: cleanEmail },
          data: { password: hashedPassword },
        }),
        // Clean up and consume token instantly to prevent reuse attack sequences
        prisma.passwordResetToken.delete({
          where: { id: resetToken.id },
        })
      ]);
    } catch (dbTxError) {
      return handleResetVerifyRouteError(dbTxError, "Failed finalizing password rewrite rules inside the core schema engine.");
    }

    // 6. Return successful processing indicator block
    return NextResponse.json({
      success: true,
    });

  } catch (globalCatchError) {
    return handleResetVerifyRouteError(globalCatchError, "The password update validation pipeline encountered an unhandled execution core thread break.");
  }
}