import { NextResponse } from "next/server";

import {
  getPendingUsers,
} from "@/actions/admin";

export async function GET() {
  const users =
    await getPendingUsers();

  return NextResponse.json(
    users
  );
}