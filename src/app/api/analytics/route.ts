import { NextResponse } from "next/server";

import { auth } from "@/auth";

import { getAnalytics } from "@/actions/analytics";
import { getPortfolioByUserId } from "@/actions/portfolio";

export async function POST(
  req: Request
) {
  const session =
    await auth();

  if (
    !session?.user?.id
  ) {
    return NextResponse.json(
      {
        error:
          "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const body =
    await req.json();

  const portfolio =
    await getPortfolioByUserId(
      session.user.id
    );

  if (
    !portfolio ||
    portfolio.id !==
      body.portfolioId
  ) {
    return NextResponse.json(
      {
        error:
          "Forbidden",
      },
      {
        status: 403,
      }
    );
  }

  const analytics =
    await getAnalytics(
      body.portfolioId
    );

  return NextResponse.json(
    analytics
  );
}