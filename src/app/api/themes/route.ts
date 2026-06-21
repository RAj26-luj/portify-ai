import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getPortfolioByUserId } from "@/actions/portfolio";
import { getThemes } from "@/actions/theme";

/**
 * Transforms session access violations, missing workspace records, or theme asset catalog
 * lookup bottlenecks into standard JSON HTTP payloads optimized for layout configuration UI.
 */
function handleThemesFetchRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Global Themes Catalog Fetch Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return NextResponse.json(
      { success: false, error: "The theme catalog datastore is temporarily performing background modifications. Please try again." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status }
  );
}

export async function GET() {
  try {
    // 1. Session Authorization Guard Check
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication validation missing: Active user session token is required." },
        { status: 401 }
      );
    }

    // 2. Cross-Reference Account Portfolio Workspace Mapping
    let portfolio;
    try {
      portfolio = await getPortfolioByUserId(session.user.id);
    } catch (lookupError) {
      return handleThemesFetchRouteError(lookupError, "Failed mapping workspace profile properties fields context.");
    }

    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: "Search query cancelled: No active custom profile layout found connected to your account." },
        { status: 404 }
      );
    }

    // 3. Query Design Presets Catalog Records Layer
    let themes;
    try {
      themes = await getThemes();
    } catch (actionError) {
      return handleThemesFetchRouteError(actionError, "Failed compiling layout appearance skins catalog matrix from core modules.");
    }

    // 4. Return Standard Contract Success Signature
    return NextResponse.json(
      {
        success: true,
        data: themes,
      },
      { status: 200 }
    );

  } catch (globalCatchError) {
    return handleThemesFetchRouteError(globalCatchError, "The theme resolution engine routing channel encountered an unhandled execution thread break.");
  }
}