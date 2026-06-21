import { NextResponse } from "next/server";
import { auth } from "@/auth";

import {
  uploadDocument,
  uploadImage,
  uploadVideo,
} from "@/lib/upload";

import { rateLimit } from "@/lib/rate-limit";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary-folders";

const folders = Object.values(CLOUDINARY_FOLDERS);

type UploadType = "image" | "video" | "document";

/**
 * Transforms rate limit overrides, provider connection dropouts, chunk sizing caps,
 * or storage mapping failures into predictable HTTP JSON response payloads.
 */
function handleUploadRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("Cloud Storage File Upload Gateway Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
    return NextResponse.json(
      { success: false, error: "Malformed payload layout configuration constraints format." },
      { status: 400 }
    );
  }
  if (errorMessage.includes("Cloudinary") || errorMessage.includes("size") || errorMessage.includes("limit")) {
    return NextResponse.json(
      { success: false, error: "The CDN storage cluster rejected the attachment payload. Check file size limits." },
      { status: 413 }
    );
  }

  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status }
  );
}

export async function POST(req: Request) {
  try {
    // 1. Session Authorization Guard Context Check
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Authentication token validation signature is missing." },
        { status: 401 }
      );
    }

    // 2. Network Identity Extraction & Rate Limiting Guard
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    
    let limit;
    try {
      limit = rateLimit(`upload:${ip}`, 20, 60_000);
    } catch (limitError) {
      console.error("Upload gateway rate limiter module failure:", limitError);
      limit = { success: true }; // Safe pass sandbox fallguard
    }

    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: "Too many consecutive file upload operations sent. Please wait 60 seconds." },
        { status: 429 }
      );
    }

    // 3. Safe Request Body Extraction
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return handleUploadRouteError(jsonError, "Failed decoding file streaming transaction boundaries.", 400);
    }

    const file = body.file;
    const folder = body.folder;
    const type = body.type as UploadType;

    // 4. Input Validity & Constraint Pre-flight Checks
    if (!file || !folder || !type) {
      return NextResponse.json(
        { success: false, error: "Validation failed: Asset source string, destination folder path, and asset type are required." },
        { status: 400 }
      );
    }

    if (!folders.includes(folder)) {
      return NextResponse.json(
        { success: false, error: `Routing constraint violation: The configuration target path directory '${folder}' is unsupported.` },
        { status: 400 }
      );
    }

    let result: any;

    // 5. Execution Pipeline Switching Core
    try {
      switch (type) {
        case "image":
          result = await uploadImage(file, folder);
          break;

        case "video":
          result = await uploadVideo(file, folder);
          break;

        case "document":
          result = await uploadDocument(file, folder);
          break;

        default:
          return NextResponse.json(
            { success: false, error: `Invalid operation: The upload processing pipeline '${type}' is completely unknown.` },
            { status: 400 }
          );
      }
    } catch (providerError) {
      return handleUploadRouteError(providerError, "The integration network timed out streaming your data packet directly to the CDN layer.");
    }

    // 6. Uniform Success Output Contract Payload Map
    return NextResponse.json(
      {
        success: true,
        data: {
          publicId: result?.publicId,
          url: result?.url,
          name: result?.fileName,
          size: result?.bytes,
          type: result?.type,
          format: result?.format,
        },
      },
      { status: 200 }
    );

  } catch (globalCatchError) {
    return handleUploadRouteError(globalCatchError, "The file distribution gateway processing engine hit an unhandled exception.");
  }
}