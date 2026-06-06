import { NextResponse } from "next/server";

import {
  approveUser,
  rejectUser,
} from "@/actions/approval";

export async function POST(
  req: Request
) {
  const body = await req.json();

  if (body.action === "approve") {
    await approveUser(
      body.userId
    );
  }

  if (body.action === "reject") {
    await rejectUser(
      body.userId
    );
  }

  return NextResponse.json({
    success: true,
  });
}