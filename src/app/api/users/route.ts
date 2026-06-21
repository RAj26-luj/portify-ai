import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllUsers } from "@/actions/admin";
import {
  blockUser,
  unblockUser,
} from "@/actions/user";

/**
 * Transforms session access violations, execution timeouts, missing properties fields, 
 * or suspension script exceptions into streamlined JSON HTTP contract responses.
 */
function handleAdminUsersRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Administrative User Directory Controller Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed request payload configuration properties format matrix." },
      { status: 400 }
    );
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return NextResponse.json(
      { success: false, error: "The identity credential ledger is running background transactions. Please execute toggle again." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status }
  );
}

/* -------------------------------------------------------------------------- */
/* GET: FETCH ALL USER PROFILE RECORDS                                       */
/* -------------------------------------------------------------------------- */
export async function GET() {
  try {
    // 1. Session Authorization Guard Context Check
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Access Denied: Administrative security clearance parameters required to query directory records." },
        { status: 401 }
      );
    }

    // 2. Query administrative directory lines layer
    let result;
    try {
      result = await getAllUsers();
    } catch (actionError) {
      return handleAdminUsersRouteError(actionError, "Failed compiling active credential directory tracks from core modules.");
    }

    // Fixed response-shape evaluation to properly unpack nested server action wrapper data arrays
    if (result.success === false) {
      return NextResponse.json(result, { status: 500 });
    }

    // 3. Return successful unified payload contract footprint
    return NextResponse.json(
      {
        success: true,
        users: result.data,
      },
      { status: 200 }
    );

  } catch (globalCatchError) {
    return handleAdminUsersRouteError(globalCatchError, "The user directory lookup gateway hit an unhandled core thread exception.");
  }
}

/* -------------------------------------------------------------------------- */
/* PATCH: ALTER ACCOUNT PRIVILEGES (BLOCK / UNBLOCK)                         */
/* -------------------------------------------------------------------------- */
export async function PATCH(req: Request) {
  try {
    // 1. Session Authorization Guard Context Check
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Access Denied: Administrative authority credentials required to modify user activation states." },
        { status: 401 }
      );
    }

    // 2. Safe JSON Body Content Extraction
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return handleAdminUsersRouteError(jsonError, "Failed decoding modification tracking parameter layouts.", 400);
    }

    const { id, type } = body;

    // 3. Pre-flight structural property parameters verification check
    if (!id || !type) {
      return NextResponse.json(
        { success: false, error: "Validation failed: Explicit user 'id' row index tracker and transition 'type' are required parameters." },
        { status: 400 }
      );
    }

    const cleanType = String(type).toUpperCase().trim();

    // 4. Status Process Chain Mapping Switches
    if (cleanType === "BLOCK") {
      try {
        await blockUser(id);
      } catch (actionError) {
        return handleAdminUsersRouteError(actionError, "The account controller module failed writing suspension status attributes.");
      }
    } else if (cleanType === "UNBLOCK") {
      try {
        await unblockUser(id);
      } catch (actionError) {
        return handleAdminUsersRouteError(actionError, "The account controller module failed executing clearance status routines.");
      }
    } else {
      return NextResponse.json(
        { success: false, error: `Invalid operation parameter: The account mutation process type '${type}' is completely unsupported.` },
        { status: 400 }
      );
    }

    // 5. Return uniform status transaction success state signature
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (globalCatchError) {
    return handleAdminUsersRouteError(globalCatchError, "The privilege adjustment processing pipeline hit an unhandled thread crash.");
  }
}