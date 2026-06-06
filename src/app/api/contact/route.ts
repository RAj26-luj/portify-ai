import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/services/email/send-contact-email";

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const message =
      await prisma.contactMessage.create(
        {
          data: {
            name: body.name,
            email: body.email,
            subject:
              body.subject,
            message:
              body.message,

            portfolio: {
              connect: {
                id: body.portfolioId,
              },
            },
          },
        }
      );

    const portfolio =
      await prisma.portfolio.findUnique({
        where: {
          id: body.portfolioId,
        },
        include: {
          user: true,
        },
      });

    if (
      portfolio?.user?.email
    ) {
      await sendContactEmail({
        ownerEmail:
          portfolio.user.email,

        visitorName:
          body.name,

        visitorEmail:
          body.email,

        subject:
          body.subject,

        message:
          body.message,
      });
    }

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
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