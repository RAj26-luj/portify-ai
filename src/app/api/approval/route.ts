import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import {
  approveUser,
  rejectUser,
  getApprovalRequests,
} from "@/actions/approval";

import { UserRole } from "@prisma/client";

/**
 * Transforms session access breaches, query timeouts, or registration payload anomalies 
 * into streamlined JSON HTTP structures tailored for instant administrative dashboard flashes.
 */
function handleApprovalRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Administrative Approval Framework Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed operational parameters matrix stream configuration payload." },
      { status: 400 }
    );
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return NextResponse.json(
      { success: false, error: "The account verification ledger is currently executing background structural re-indexing. Please sync grid shortly." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status }
  );
}

/* -------------------------------------------------------------------------- */
/* GET: FETCH REQUESTS                                                       */
/* -------------------------------------------------------------------------- */
export async function GET() {
  try {
    const session = await auth();

    // Strict Admin Access Guard
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Administrative security level parameters required to query ledger records." },
        { status: 401 }
      );
    }

    let result;
    try {
      result = await getApprovalRequests();
    } catch (actionError) {
      return handleApprovalRouteError(actionError, "Failed to compile background layout requests feed from the core layer.");
    }

    // Fixed response-shape extraction logic safely unpacking server action wrappers
    if (result.success === false) {
      return NextResponse.json(result, {
        status: 500,
      });
    }

    return NextResponse.json(
      {
        success: true,
        approvals: result.data,
      },
      { status: 200 }
    );
  } catch (globalCatchError) {
    return handleApprovalRouteError(globalCatchError, "The request pipeline encountered an unhandled administrative thread crash.");
  }
}

/* -------------------------------------------------------------------------- */
/* PATCH: PROCESS APPROVE / REJECT                                            */
/* -------------------------------------------------------------------------- */
export async function PATCH(req: Request) {
  try {
    const session = await auth();

    // Strict Admin Access Guard
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Administrative authority credentials required to override user registration statuses." },
        { status: 401 }
      );
    }

    // Safe JSON Parse Layer
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return handleApprovalRouteError(jsonError, "Failed decoding modification payload vectors parameters format rules.", 400);
    }

    const { id, type, reason } = body;

    // Structural Parameter Guard
    if (!id || !type) {
      return NextResponse.json(
        { success: false, error: "Validation failed: Explicit 'id' row tracker signature and 'type' context action state are required." },
        { status: 400 }
      );
    }

    // Reference Identity Lookup
    const approval = await prisma.approvalRequest.findUnique({
      where: { id },
    });

    if (!approval) {
      return NextResponse.json(
        { success: false, error: `Search failure: No matching registration approval log row exists for index value '${id}'.` },
        { status: 404 }
      );
    }

    // Status Process Chain Mapping Switches
    if (type === "APPROVE") {
      try {
        await approveUser(approval.userId);
      } catch (mutateError) {
        return handleApprovalRouteError(mutateError, "Database mutation rejected during user status account activation steps.");
      }
    } else if (type === "REJECT") {
      try {
        await rejectUser(approval.userId, reason);
      } catch (mutateError) {
        return handleApprovalRouteError(mutateError, "Database mutation rejected during deployment suspension clearance routines.");
      }
    } else {
      return NextResponse.json(
        { success: false, error: `Invalid configuration rules: The status operation parameter '${type}' is completely unsupported.` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (globalCatchError) {
    return handleApprovalRouteError(globalCatchError, "The approval execution pipeline runtime encountered an unhandled data fault layer.");
  }
}

/* -------------------------------------------------------------------------- */
/* POST: UPSERT ONBOARDING NOTE                                               */
/* -------------------------------------------------------------------------- */
export async function POST(req: Request) {
  try {
    const session = await auth();

    // User Presence Verification Guard
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication missing: Session token identity signature is required to register onboarding requests." },
        { status: 401 }
      );
    }

    // Safe JSON Parse Layer
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return handleApprovalRouteError(jsonError, "Failed decoding application verification arguments template pack.", 400);
    }

    const { note } = body;
    const cleanNote = note?.trim() || null;

    // Isolated Upsert DB Transaction Blocks Layer
    let result;
    try {
      result = await prisma.approvalRequest.upsert({
        where: {
          userId: session.user.id,
        },
        update: {
          note: cleanNote,
        },
        create: {
          userId: session.user.id,
          note: cleanNote,
          status: "PENDING",
        },
      });
    } catch (dbError) {
      return handleApprovalRouteError(dbError, "Onboarding verification submission failed or timed out saving changes back onto user schema logs.");
    }

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (globalCatchError) {
    return handleApprovalRouteError(globalCatchError, "The verification submission engine pipeline encountered an unhandled execution core thread break.");
  }
}