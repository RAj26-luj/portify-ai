import { NextResponse } from "next/server";

import { createProject } from "@/actions/project";

export async function POST(
  req: Request
) {
  const body = await req.json();

  const project =
    await createProject(body);

  return NextResponse.json(
    project
  );
}