import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserStats } from "@/actions/admin";

/**
 * Transforms session access violations, execution timeouts, missing properties fields, 
 * or telemetry aggregation script exceptions into streamlined JSON HTTP contract responses.
 */
function handleAdminStatsRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Administrative Analytics Aggregator Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return NextResponse.json(
      { success: false, error: "The analytical telemetry data warehouse is currently rebuilding indexes. Please reload shortly." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status }
  );
}

/* -------------------------------------------------------------------------- */
/* GET: FETCH CONSOLIDATED SYSTEM METRICS & TELEMETRY                        */
/* -------------------------------------------------------------------------- */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Access Denied",
        },
        { status: 401 }
      );
    }

    const result = await getUserStats();

    if (result.success === false) {
      return NextResponse.json(
        result,
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        stats: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleAdminStatsRouteError(
      error,
      "The metrics collation framework route encountered an unhandled execution process thread break."
    );
  }
}