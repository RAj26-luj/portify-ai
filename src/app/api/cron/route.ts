import { NextResponse } from "next/server";

import { runCleanupJobs } from "@/jobs/cleanup";
import { deleteExpiredSeenMessages } from "@/services/contact";

function handleCronRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("System Core Maintenance CRON API Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Maintenance pipeline aborted: The datastore layer is currently undergoing intense transactional loads or locks.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { success: false, error: `${fallbackMessage} Trace detail: ${errorMessage}` },
    { status }
  );
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = process.env.CRON_SECRET;

    if (!secret || secret.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Environment failure: The system environmental variable 'CRON_SECRET' is not configured on this context layer.",
        },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Access Denied: The signature token verification key provided is completely invalid or unauthorized.",
        },
        { status: 401 }
      );
    }

    let cleanupResult = null;
    try {
      cleanupResult = await runCleanupJobs();
    } catch (cleanupJobError) {
      console.error(
        "Critical block mismatch during macro database record purging job execution:",
        cleanupJobError
      );
      cleanupResult = {
        success: false,
        error: "The standard file/record collection wiping task crashed mid-flight.",
      };
    }

    let deletedMessages = null;
    try {
      deletedMessages = await deleteExpiredSeenMessages();
    } catch (messagePurgeError) {
      console.error(
        "Critical exception caught purging historic expired contact logs metadata:",
        messagePurgeError
      );
      deletedMessages = {
        success: false,
        error: "The conversational data wiping module failed executing script loops.",
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        cleanupResult,
        deletedMessages,
      },
    });
  } catch (globalCatchError) {
    return handleCronRouteError(
      globalCatchError,
      "The maintenance routine engine route hit an unhandled processing break layer."
    );
  }
}
