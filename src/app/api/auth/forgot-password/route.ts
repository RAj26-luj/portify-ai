import crypto from "crypto";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendForgotPasswordEmail } from "@/services/email/send-forgot-password-email";
export async function POST(
  req: Request
) {
  try {
    const { email } =
      await req.json();

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
          1000 *
            60 *
            60
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
      token,
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