"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

import { registerSchema } from "@/validators/auth/register";
import { loginSchema } from "@/validators/auth/login";
import { forgotPasswordSchema } from "@/validators/auth/forgot-password";
import { resetPasswordSchema } from "@/validators/auth/reset-password";

import { sendVerificationEmail, sendForgotPasswordEmail } from "@/services/email";

import { logRegistration, logPasswordReset } from "@/lib/audit-log";

// Error
function handleAuthServerError(error: any, fallbackMessage: string) {
  console.error("Authentication Service Server Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return {
      success: false,
      error: "Authentication service lookup timed out. Please try logging in again shortly.",
    };
  }
  if (errorMessage.includes("bcrypt") || errorMessage.includes("hash")) {
    return {
      success: false,
      error:
        "Security cryptography service encountered an issue. Please try resubmitting your form.",
    };
  }
  if (
    errorMessage.includes("mail") ||
    errorMessage.includes("smtp") ||
    errorMessage.includes("Verification")
  ) {
    return {
      success: false,
      error:
        "Account created but delivery of verification code failed. Please go to forgot password to request a new code.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function registerUser(data: unknown) {
  try {
    const parsed = registerSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        error:
          "Registration metrics invalid. Please ensure all required fields are correctly formatted.",
      };
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existing) {
      return {
        success: false,
        error: "This email address is already registered on Portify AI.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const baseUsername = email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    const username = `${baseUsername}_${Date.now()}`;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
        status: "PENDING",
      },
    });

    const existingPortfolio = await prisma.portfolio.findFirst({
      where: {
        username,
      },
    });

    const portfolioUsername = existingPortfolio ? `${username}-${Date.now()}` : username;

    const slug = `${portfolioUsername}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, "");

    await prisma.portfolio.create({
      data: {
        userId: user.id,
        username: portfolioUsername,
        slug,
        category: "STUDENT",
        status: "DRAFT",
        title: `${name}'s Portfolio`,
        onboardingCompleted: false,
        publishReady: false,

        sectionSettings: {
          create: [
            {
              sectionKey: "hero",
              title: "Hero",
              mandatory: true,
              isEnabled: true,
              displayOrder: 0,
            },
            {
              sectionKey: "about",
              title: "About",
              mandatory: true,
              isEnabled: true,
              displayOrder: 1,
            },
            { sectionKey: "experience", title: "Experience", isEnabled: true, displayOrder: 2 },
            { sectionKey: "education", title: "Education", isEnabled: true, displayOrder: 3 },
            { sectionKey: "skills", title: "Skills", isEnabled: true, displayOrder: 4 },
            { sectionKey: "projects", title: "Projects", isEnabled: true, displayOrder: 5 },
            { sectionKey: "opensource", title: "Open Source", isEnabled: true, displayOrder: 6 },
            { sectionKey: "achievements", title: "Achievements", isEnabled: true, displayOrder: 7 },
            {
              sectionKey: "certifications",
              title: "Certifications",
              isEnabled: true,
              displayOrder: 8,
            },
            { sectionKey: "publications", title: "Publications", isEnabled: true, displayOrder: 9 },
            {
              sectionKey: "testimonials",
              title: "Testimonials",
              isEnabled: true,
              displayOrder: 10,
            },
            {
              sectionKey: "codingprofiles",
              title: "Coding Profiles",
              isEnabled: true,
              displayOrder: 11,
            },
            { sectionKey: "sociallinks", title: "Social Links", isEnabled: true, displayOrder: 12 },
            {
              sectionKey: "contact",
              title: "Contact",
              mandatory: true,
              isEnabled: true,
              displayOrder: 999,
            },
          ],
        },

        analytics: {
          create: {},
        },

        themePreference: {
          create: {},
        },
      },
    });

    const token = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    try {
      await sendVerificationEmail(email, token);
    } catch (mailError) {
      console.error("Non-blocking email delivery engine error during registration:", mailError);
    }

    try {
      await logRegistration(user.id, {
        email: user.email,
      });
    } catch (logError) {
      console.error("Non-blocking registration audit log registration failed:", logError);
    }

    return {
      success: true,
      userId: user.id,
    };
  } catch (error) {
    return handleAuthServerError(
      error,
      "Unable to complete account registration lifecycle profile."
    );
  }
}

export async function loginUser(data: unknown) {
  try {
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        error: "Credentials specification missing or invalid format rules.",
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
    });

    if (!user || !user.password) {
      return {
        success: false,
        error: "Invalid credentials. Please verify your email and password entry.",
      };
    }

    const validPassword = await bcrypt.compare(parsed.data.password, user.password);

    if (!validPassword) {
      return {
        success: false,
        error: "Invalid credentials. Please verify your email and password entry.",
      };
    }

    if (user.isBlocked) {
      return {
        success: false,
        error:
          "Your user account status has been blocked. Please reach out to administrative support.",
      };
    }

    if (user.status !== "APPROVED") {
      return {
        success: false,
        error:
          "Your user access application profile is still pending security verification approval.",
      };
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLogin: new Date(),
      },
    });

    return {
      success: true,
      userId: user.id,
    };
  } catch (error) {
    return handleAuthServerError(
      error,
      "Security system validation processing error encountered during sign in."
    );
  }
}

export async function forgotPassword(data: unknown) {
  try {
    const parsed = forgotPasswordSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: true,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
    });

    if (!user) {
      return {
        success: true,
      };
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    try {
      await sendForgotPasswordEmail(user.email, token);
    } catch (mailError) {
      console.error("Non-blocking safety recovery credentials dispatch failure:", mailError);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed handling forgot password system loop generation:", error);
    return {
      success: true,
    };
  }
}

export async function resetPassword(data: unknown) {
  try {
    const parsed = resetPasswordSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        error: "Password reset processing structure parameters are invalid.",
      };
    }

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: parsed.data.token,
      },
    });

    if (!resetToken) {
      return {
        success: false,
        error: "The authentication code is invalid or has already been used.",
      };
    }

    if (resetToken.expiresAt < new Date()) {
      return {
        success: false,
        error:
          "The authentication code has expired. Please initiate a new password reset sequence.",
      };
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

    const user = await prisma.user.update({
      where: {
        email: resetToken.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    try {
      await logPasswordReset(user.id, {
        email: user.email,
        source: "forgot_password",
      });
    } catch (logError) {
      console.error("Non-blocking reset configuration log sequence registration error:", logError);
    }

    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    return handleAuthServerError(error, "Failed to apply cryptographic credentials modification.");
  }
}
