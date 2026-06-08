import { NextResponse } from "next/server";

import { auth } from "@/auth";

import {
  createPortfolio,
  exportPortfolio,
} from "@/actions/portfolio";

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
    await createPortfolio(
      session.user.id,
      body.username,
      body.category
    );

  return NextResponse.json(
    portfolio
  );
}

export async function GET(
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

  const {
    searchParams,
  } = new URL(req.url);

  const portfolioId =
    searchParams.get(
      "portfolioId"
    );

  if (
    !portfolioId
  ) {
    return NextResponse.json(
      {
        error:
          "portfolioId is required",
      },
      {
        status: 400,
      }
    );
  }

  const data =
    await exportPortfolio(
      portfolioId
    );

  return NextResponse.json(
    data
  );
}