import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";

import { deleteAccount } from "@/actions/delete-account";

export async function DELETE(
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
        `delete-account:${ip}`,
        3,
        60 * 60 * 1000
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

    await deleteAccount(
      session.user.id
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
            : "Failed to delete account",
      },
      {
        status: 500,
      }
    );
  }
}