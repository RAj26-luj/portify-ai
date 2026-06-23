"use server";

import { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/services/email";

// Error
function handleResendServerError(error: any, fallbackMessage: string) {
  console.error("Resend Verification Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("Email already verified")) {
    return {
      success: false,
      error: "This email address is already verified. Please proceed directly to sign in.",
    };
  }
  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return {
      success: false,
      error:
        "The security access engine is temporarily busy syncing layout configurations. Please request a code again shortly.",
    };
  }
  if (
    errorMessage.includes("mail") ||
    errorMessage.includes("smtp") ||
    errorMessage.includes("send")
  ) {
    return {
      success: false,
      error:
        "The account lookup succeeded, but dispatching the code failed. Please verify your connection or try again later.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function resendVerification(email: string) {
  try {
    if (!email) {
      return {
        success: false,
        error: "An email address field parameter must be supplied to route verification codes.",
      };
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return {
        success: true,
      };
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: "Verification failed: The user profile specified has already been completed.",
      };
    }

    await prisma.verificationToken.deleteMany({
      where: {
        identifier: normalizedEmail,
      },
    });

    const token = randomUUID();

    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    try {
      await sendVerificationEmail(normalizedEmail, token);
    } catch (mailError) {
      return handleResendServerError(
        mailError,
        "Verification token was renewed but email courier system failed to deliver."
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    return handleResendServerError(
      error,
      "Failed to complete access validation tracking code renewal parameters loop."
    );
  }
}
