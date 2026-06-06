import { NextResponse } from "next/server";

import {
  getThemes,
} from "@/services/theme";

export async function GET() {
  const themes =
    await getThemes();

  return NextResponse.json(
    themes
  );
}
