import { NextResponse } from "next/server";

import { auth } from "@/auth";

import { activateTheme } from "@/actions/theme";
import { getPortfolioByUserId } from "@/actions/portfolio";

function handleThemeActivationRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Theme Activation Pipeline Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed request payload configuration properties format." },
      { status: 400 }
    );
  }
  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "The visual appearance datastore is running background data synchronization logs. Please toggle status again.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ success: false, error: fallbackMessage }, { status });
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication validation missing: Active user session token required.",
        },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return handleThemeActivationRouteError(
        jsonError,
        "Failed decoding incoming tracking data packet layouts.",
        400
      );
    }

    const { portfolioId, themeId } = body;

    if (!portfolioId || !themeId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Validation failed: Explicit 'portfolioId' link target and target 'themeId' identifier parameters are required.",
        },
        { status: 400 }
      );
    }

    let portfolio;
    try {
      portfolio = await getPortfolioByUserId(session.user.id);
    } catch (lookupError) {
      return handleThemeActivationRouteError(
        lookupError,
        "Failed mapping account assets configuration metrics logs."
      );
    }

    if (!portfolio.success || !portfolio.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Portfolio not found.",
        },
        { status: 404 }
      );
    }

    if (portfolio.data.id !== portfolioId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Access Denied: The target profile identifier parameters do not line up with the authenticated profile account.",
        },
        { status: 403 }
      );
    }

    let result;
    try {
      result = await activateTheme(portfolioId, themeId);
    } catch (actionError) {
      return handleThemeActivationRouteError(
        actionError,
        "The theme manager engine failed rewriting presentation design configurations."
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (globalCatchError) {
    return handleThemeActivationRouteError(
      globalCatchError,
      "The theme controller pipeline router hit an unhandled processing break layer."
    );
  }
}
