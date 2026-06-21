import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

import { sendContactEmail } from "@/services/email/send-contact-email";
import { trackContactRequest } from "@/services/analytics";

/**
 * Transforms client contact delivery issues, rate limits, or missing portfolio maps 
 * into streamlined JSON HTTP structures tailored for instant client-side form feedback flashes.
 */
function handleContactRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Public Portfolio Contact Form Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed request payload layout data packet parameters format." },
      { status: 400 }
    );
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return NextResponse.json(
      { success: false, error: "Our messaging system storage layer is currently busy processing queues. Please resubmit your message." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status }
  );
}

export async function POST(req: Request) {
  try {
    // 1. Connection Isolation & Rate Limiting Guard
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    
    let limit;
    try {
      limit = rateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
    } catch (limitError) {
      console.error("Rate limiter module lookup failure:", limitError);
      limit = { success: true }; // Safe pass failguard
    }

    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: "Too many messages sent from your connection. Please wait 15 minutes before writing again." },
        { status: 429 }
      );
    }

    // 2. Safe JSON Extraction
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return handleContactRouteError(jsonError, "Failed decoding contact request payload matrices.", 400);
    }

    // 3. Pre-flight parameter guards
    if (!body.name || !body.email || !body.message || !body.portfolioId) {
      return NextResponse.json(
        { success: false, error: "Validation failed: Your name, email, message body, and a target portfolio ID are all required." },
        { status: 400 }
      );
    }

    // 4. Resolve Target Portfolio Framework Link
    let portfolio;
    try {
      portfolio = await prisma.portfolio.findUnique({
        where: {
          id: body.portfolioId,
        },
        include: {
          user: true,
        },
      });
    } catch (dbError) {
      return handleContactRouteError(dbError, "Failed checking target profile connection entries.");
    }

    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: "Routing failure: The target portfolio account selected to receive messages does not exist." },
        { status: 404 }
      );
    }

    // 5. Database Message Registry Insertion
    let message;
    try {
      message = await prisma.contactMessage.create({
        data: {
          portfolioId: body.portfolioId,
          visitorName: body.name,
          visitorEmail: body.email,
          note: body.message,
        },
      });
    } catch (dbCreateError) {
      return handleContactRouteError(dbCreateError, "Failed saving your submission text parameters into the database storage layer.");
    }

    // 6. Background Analytical Logging Hooks
    try {
      await trackContactRequest(body.portfolioId);
    } catch (analyticsError) {
      // Log analytics failures internally without interrupting user experience flows
      console.error("Non-blocking analytics event tracking trace execution failed:", analyticsError);
    }

    // 7. Outbound Courier Delivery Integration
    if (portfolio.user?.email) {
      try {
        await sendContactEmail({
          ownerEmail: portfolio.user.email,
          visitorName: body.name,
          visitorEmail: body.email,
          subject: body.subject ?? "Portfolio Contact Request",
          message: body.message,
        });
      } catch (mailError) {
        console.error("Mailing engine rejected contact form delivery dispatch package:", mailError);
        // Note: Message is already saved in database, so return success but note the server courier delay
        return NextResponse.json(
          { 
            success: true, 
            data: message,
            message: "Your note was successfully stored inside the portfolio dashboard, though email relay system encountered slow syncs." 
          },
          { status: 201 }
        );
      }
    }

    // 8. Success Response Payload Mapping
    return NextResponse.json(
      {
        success: true,
        data: message,
      },
      { status: 201 }
    );

  } catch (globalCatchError) {
    return handleContactRouteError(globalCatchError, "The message processing gateway pipeline encountered an unhandled thread break.");
  }
}