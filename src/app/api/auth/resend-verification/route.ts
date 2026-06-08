import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

import { sendVerificationEmail } from "@/services/email/send-verification-email";

export async function POST(
  req: Request
) {
  try {
    const ip =
      req.headers.get(
        "x-forwarded-for"
      ) ?? "unknown";

    const limit =
      rateLimit(
        `resend-verification:${ip}`,
        5,
        15 * 60 * 1000
      );

    if (!limit.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many requests. Please try again later.",
        },
        {
          status: 429,
        }
      );
    }

    const { email } =
      await req.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      return NextResponse.json({
        success: true,
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
      });
    }

    await prisma.verificationToken.deleteMany(
      {
        where: {
          identifier:
            email,
        },
      }
    );

    const token =
      randomUUID();

    await prisma.verificationToken.create(
      {
        data: {
          identifier:
            email,
          token,
          expires:
            new Date(
              Date.now() +
                24 *
                  60 *
                  60 *
                  1000
            ),
        },
      }
    );

    await sendVerificationEmail(
      email,
      token
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to resend verification email",
      },
      {
        status: 500,
      }
    );
  }
}