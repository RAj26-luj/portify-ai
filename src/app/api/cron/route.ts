import { NextResponse } from "next/server";

import {
  runJobs,
} from "@/jobs";

export async function GET() {
  await runJobs();

  return NextResponse.json({
    success: true,
  });
}