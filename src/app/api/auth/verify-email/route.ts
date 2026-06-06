import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request
) {
  try {
    const { token } =
      await req.json();

    const verification =
      await prisma.verificationToken.findFirst(
        {
          where: {
            token,
          },
        }
      );

    if (
      !verification ||
      verification.expires <
        new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid token",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.user.update({
      where: {
        email:
          verification.identifier,
      },
      data: {
        emailVerified:
          new Date(),
      },
    });

    await prisma.verificationToken.delete(
      {
        where: {
          id: verification.id,
        },
      }
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