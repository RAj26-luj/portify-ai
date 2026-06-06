import { NextResponse } from "next/server";

import { getAnalytics } from "@/actions/analytics";

export async function POST(
  req: Request
) {
  const body = await req.json();

  const analytics =
    await getAnalytics(
      body.portfolioId
    );

  return NextResponse.json(
    analytics
  );
}