import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

import { sendContactEmail } from "@/services/email/send-contact-email";

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
        `contact:${ip}`,
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

    const body =
      await req.json();

    if (
      !body.name ||
      !body.email ||
      !body.subject ||
      !body.message ||
      !body.portfolioId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

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
      await prisma.portfolio.findUnique(
        {
          where: {
            id: body.portfolioId,
          },
          include: {
            user: true,
          },
        }
      );

    if (
      portfolio?.user?.email
    ) {
      await sendContactEmail(
        {
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
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: message,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Contact request failed",
      },
      {
        status: 500,
      }
    );
  }
}