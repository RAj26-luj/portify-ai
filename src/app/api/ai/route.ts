import { NextResponse } from "next/server";

import {
  parseResume,
} from "@/services/ai";

export async function POST() {
  const result =
    await parseResume();

  return NextResponse.json(
    result
  );
}