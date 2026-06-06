import { NextResponse } from "next/server";

import { createSkill } from "@/actions/skill";

export async function POST(
  req: Request
) {
  const body = await req.json();

  const skill =
    await createSkill(
      body.portfolioId,
      body.name,
      body.category
    );

  return NextResponse.json(
    skill
  );
}