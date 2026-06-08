import { NextResponse } from "next/server";

import { auth } from "@/auth";

import {
  getPendingUsers,
} from "@/actions/admin";

export async function GET() {
  const session =
    await auth();

  if (
    !session?.user ||
    session.user.role !==
      "ADMIN"
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

  const users =
    await getPendingUsers();

  return NextResponse.json(
    users
  );
}