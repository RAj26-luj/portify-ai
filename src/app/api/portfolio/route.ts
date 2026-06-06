import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createPortfolio } from "@/actions/portfolio";

export async function POST(
  req: Request
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const body = await req.json();

  const portfolio =
    await createPortfolio(
      session.user.id,
      body.username
    );

  return NextResponse.json(
    portfolio
  );
}