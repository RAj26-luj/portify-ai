import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserStatus } from "@prisma/client";
import { sendAdminNotification } from "@/services/email/send-admin-notification";

/**
 * Transforms token resolution drops, verification expiration blocks, or outbound notification 
 * failures into standard JSON payloads optimized for rendering inline account setup wizards.
 */
function handleVerifyOtpRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Account Activation Verification OTP API Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed request payload metadata format streams." },
      { status: 400 }
    );
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return NextResponse.json(
      { success: false, error: "The account validation ledger is temporarily locked processing secure credentials. Please submit your token string again." },
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
      return handleVerifyOtpRouteError(jsonError, "Failed to decode incoming authentication data stream blocks.", 400);
    }

    const { email, token } = body;

    // 2. Pre-flight parameter guards
    if (!email || !token) {
      return NextResponse.json(
        { success: false, error: "Validation failed: A target email address and matching 6-digit OTP code string are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanToken = String(token).trim();

    // 3. Temporary token registration lookup
    let verification;
    try {
      verification = await prisma.verificationToken.findFirst({
        where: {
          identifier: cleanEmail,
          token: cleanToken,
        },
      });
    } catch (dbError) {
      return handleVerifyOtpRouteError(dbError, "Failed checking validation ledger parameters.");
    }

    if (!verification || verification.expires < new Date()) {
      return NextResponse.json(
        { success: false, error: "The activation code provided is incorrect, completely invalid, or has expired." },
        { status: 400 }
      );
    }

    // 4. Resolve core profile link before database transaction updates
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: verification.identifier },
      });
    } catch (dbError) {
      return handleVerifyOtpRouteError(dbError, "Failed to map existing profile reference data lines.");
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Verification aborted: No matching user account context exists for this credential." },
        { status: 404 }
      );
    }

    // 5. Atomic Transaction Layer for Account Verification State
    try {
      await prisma.$transaction([
        // Update core user verification stamps
        prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerified: new Date(),
            status: UserStatus.PENDING,
          },
        }),
        // Upsert onboarding registry to securely manage unique relation life cycles
        prisma.approvalRequest.upsert({
          where: { userId: user.id },
          update: { status: "PENDING" },
          create: { userId: user.id, status: "PENDING" },
        }),
        // Consume and strip temporary token immediately to guarantee single use
        prisma.verificationToken.delete({
          where: { id: verification.id },
        })
      ]);
    } catch (txError) {
      return handleVerifyOtpRouteError(txError, "Failed to commit unified account confirmation changes onto database tables.");
    }

    // 6. Outbound Administrative Pushes
    try {
      await sendAdminNotification(
        "New User Awaiting Approval",
        `${user.name || "A new candidate"} (${user.email}) has successfully verified their email address and is now awaiting clearance approval.`
      );
    } catch (mailError) {
      // Log notification failures but don't crash user's verified status experience
      console.error("Non-blocking administrative alert courier failed to deliver:", mailError);
    }

    // 7. Success signature response payload mapping
    return NextResponse.json({
      success: true,
      message: "Email verified successfully. Your profile has been queued for administrative approval review.",
    });

  } catch (globalCatchError) {
    return handleVerifyOtpRouteError(globalCatchError, "The OTP check pipeline encountered an unhandled execution core thread break.");
  }
}