import { NextResponse } from "next/server";

import { activateTheme } from "@/actions/theme";

export async function POST(
  req: Request
) {
  try {
    const {
      portfolioId,
      themeId,
    } = await req.json();

    const result =
      await activateTheme(
        portfolioId,
        themeId
      );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}