import crypto from "crypto";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

import { sendForgotPasswordEmail } from "@/services/email/send-forgot-password-email";

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
        `forgot-password:${ip}`,
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
      await prisma.user.findUnique(
        {
          where: {
            email,
          },
        }
      );

    if (!user) {
      return NextResponse.json({
        success: true,
      });
    }

    const token =
      crypto.randomBytes(
        32
      ).toString("hex");

    const expires =
      new Date(
        Date.now() +
          60 *
            60 *
            1000
      );

    await prisma.verificationToken.deleteMany(
      {
        where: {
          identifier:
            email,
        },
      }
    );

    await prisma.verificationToken.create(
      {
        data: {
          identifier:
            email,
          token,
          expires,
        },
      }
    );

    await sendForgotPasswordEmail(
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
            : "Failed to process request",
      },
      {
        status: 500,
      }
    );
  }
}