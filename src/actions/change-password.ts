"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { logPasswordReset } from "@/lib/audit-log";

// Error
function handleChangePasswordServerError(error: any, fallbackMessage: string) {
  console.error("Change Password Service Server Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("User not found")) {
    return { success: false, error: "The requested user account record could not be located." };
  }
  if (errorMessage.includes("Account is blocked")) {
    return {
      success: false,
      error: "This operation is suspended because the user account is blocked.",
    };
  }
  if (errorMessage.includes("New password must be different")) {
    return {
      success: false,
      error:
        "Security rule mismatch: Your new password must be completely different from your previous password.",
    };
  }
  if (errorMessage.includes("Password must be at least 8 characters")) {
    return {
      success: false,
      error:
        "Complexity mismatch: Your new password configuration must comprise at least 8 structural characters.",
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
        "The security storage engine is currently running data synchronization operations. Please try again shortly.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function changePassword(userId: string, newPassword: string) {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User profile reference identity key parameter is required.",
      };
    }

    if (!newPassword) {
      return { success: false, error: "New credentials target cannot be parsed as empty strings." };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        password: true,
        isBlocked: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User account matching the provided identity reference was not found.",
      };
    }

    if (user.isBlocked) {
      return {
        success: false,
        error: "Account modifications are restricted because this profile has been blocked.",
      };
    }

    if (user.password) {
      const samePassword = await bcrypt.compare(newPassword, user.password);

      if (samePassword) {
        return {
          success: false,
          error:
            "Security conflict: Please design a new password that differs from your active credentials.",
        };
      }
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        error:
          "Security criteria failed: Passwords must contain a minimum of 8 validation layout characters.",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    try {
      await logPasswordReset(userId, {
        email: user.email,
        source: "change_password",
      });
    } catch (logError) {
      console.error(
        "Non-blocking security change sequence log file recording exception:",
        logError
      );
    }

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    return handleChangePasswordServerError(
      error,
      "Failed to apply password reconfiguration rules onto profile credentials store."
    );
  }
}
