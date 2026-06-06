import { NextResponse } from "next/server";

import { getAllUsers } from "@/actions/admin";

export async function GET() {
  const users =
    await getAllUsers();

  return NextResponse.json(
    users
  );
}