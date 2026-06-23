import { NextResponse } from "next/server";

function handleWebhookRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("External Webhook Integration Endpoint Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed payload layout parameters matrix configuration stream." },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: false, error: fallbackMessage }, { status });
}

export async function POST(req: Request) {
  try {
    return NextResponse.json(
      {
        success: true,
        received: true,
      },
      { status: 200 }
    );
  } catch (globalCatchError) {
    return handleWebhookRouteError(
      globalCatchError,
      "The webhook broker ingestion pipeline encountered an unhandled execution core thread break."
    );
  }
}
