import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/services/email/send-verification-email";

export async function POST(
  req: Request
) {
  try {
    const { email } =
      await req.json();

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
          identifier: email,
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
                1000 *
                  60 *
                  60 *
                  24
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
  } catch {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}