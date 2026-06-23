import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendVerificationEmail } from "@/services/email/send-verification-email";

function handleVerificationRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Verification Dispatcher API Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed payload layout data packet parameters format." },
      { status: 400 }
    );
  }
  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: fallbackMessage }, { status });
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";

    let limit;
    try {
      limit = rateLimit(`resend-verification:${ip}`, 5, 15 * 60 * 1000);
    } catch (limitError) {
      console.error("Rate limit hardware system drop:", limitError);
      limit = { success: true };
    }

    if (!limit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many dispatch requests from this source. Please retry in 15 minutes.",
        },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return handleVerificationRouteError(
        jsonError,
        "Failed decoding authentication token routing parameters.",
        400
      );
    }

    const { email } = body;

    if (!email || String(email).trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Target recipient identity missing. Email address parameter field is required.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
    } catch (dbError) {
      return handleVerificationRouteError(
        dbError,
        "Data engine layer failed checking active profile registrations."
      );
    }

    if (!user) {
      return NextResponse.json({ success: true });
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: true });
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await prisma.verificationToken.deleteMany({
        where: { identifier: normalizedEmail },
      });

      await prisma.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
    } catch (dbTxError) {
      return handleVerificationRouteError(
        dbTxError,
        "Security access engine failed rotating verification reference parameters."
      );
    }

    try {
      await sendVerificationEmail(normalizedEmail, token);
    } catch (mailError) {
      console.error("Mailing engine rejected token dispatch payload:", mailError);
      return NextResponse.json(
        {
          success: false,
          error:
            "Verification process initialized, but our mail delivery network failed to push the code. Try again.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (globalCatchError) {
    return handleVerificationRouteError(
      globalCatchError,
      "The verification pipeline encountered an unhandled execution process thread failure."
    );
  }
}
