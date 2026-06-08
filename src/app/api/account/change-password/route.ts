import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";

import { changePassword } from "@/actions/change-password";

export async function POST(
  req: Request
) {
  try {
    const session =
      await auth();

    if (
      !session?.user?.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const ip =
      req.headers.get(
        "x-forwarded-for"
      ) ?? "unknown";

    const limit =
      rateLimit(
        `change-password:${ip}`,
        5,
        15 * 60 * 1000
      );

    if (!limit.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many requests",
        },
        {
          status: 429,
        }
      );
    }

    const body =
      await req.json();

    await changePassword(
      session.user.id,
      body.currentPassword,
      body.newPassword
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
            : "Failed to change password",
      },
      {
        status: 500,
      }
    );
  }
}