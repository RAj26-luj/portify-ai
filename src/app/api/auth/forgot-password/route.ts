import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendForgotPasswordEmail } from "@/services/email/send-forgot-password-email";

function handleRecoveryRouteError(
  error: unknown,
  fallbackMessage: string,
  status = 500
): NextResponse {
  console.error(
    "Password Recovery System Route Exception:",
    error
  );

  const errorMessage =
    error instanceof Error
      ? error.message
      : String(error);

  if (
    errorMessage.includes("SyntaxError") ||
    errorMessage.includes("JSON")
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Malformed payload layout metadata format streams.",
      },
      { status: 400 }
    );
  }

  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return NextResponse.json({
      success: true,
    });
  }

  return NextResponse.json(
    {
      success: false,
      error: fallbackMessage,
    },
    { status }
  );
}

export async function POST(
  req: Request
): Promise<Response> {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ??
      "unknown";

    let limit: {
      success: boolean;
    };

    try {
      limit = rateLimit(
        `forgot-password:${ip}`,
        5,
        15 * 60 * 1000
      );
    } catch (limitError) {
      console.error(
        "Rate limiter subsystem exception:",
        limitError
      );

      limit = {
        success: true,
      };
    }

    if (!limit.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many recovery attempts from this connection source. Please try again in 15 minutes.",
        },
        { status: 429 }
      );
    }

    let body: {
      email?: string;
    };

    try {
      body = await req.json();
    } catch (jsonError) {
      return handleRecoveryRouteError(
        jsonError,
        "Failed decoding authentication extraction packet parameters.",
        400
      );
    }

    const { email } = body;

    if (
      !email ||
      String(email).trim() === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Account identifier criteria is missing. Email address field is required.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email)
      .toLowerCase()
      .trim();

    let user;

    try {
      user = await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });
    } catch (dbError) {
      return handleRecoveryRouteError(
        dbError,
        "Data engine failed to query user parameter records."
      );
    }

    if (!user) {
      return NextResponse.json({
        success: true,
      });
    }

    const token = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    try {
      await prisma.passwordResetToken.deleteMany(
        {
          where: {
            email: normalizedEmail,
          },
        }
      );

      await prisma.passwordResetToken.create(
        {
          data: {
            email: normalizedEmail,
            token,
            expiresAt: new Date(
              Date.now() +
                60 * 60 * 1000
            ),
          },
        }
      );
    } catch (dbTxError) {
      return handleRecoveryRouteError(
        dbTxError,
        "Security configuration tracking engine failed writing temporary credentials."
      );
    }

    try {
      await sendForgotPasswordEmail(
        normalizedEmail,
        token
      );
    } catch (mailError) {
      console.error(
        "Email courier failed dispatching OTP security snapshot:",
        mailError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "The recovery request was accepted, but the communication delivery network failed. Try again later.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (globalCatchError) {
    return handleRecoveryRouteError(
      globalCatchError,
      "The password recovery validation pipeline encountered an unhandled execution core threat break."
    );
  }
}