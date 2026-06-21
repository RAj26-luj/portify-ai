import { NextResponse } from "next/server";

import { auth } from "@/auth";

import { extractResumeText } from "@/services/resume/extract-resume-text";
import { mapResumeWithGemini } from "@/services/resume/map-resume-with-gemini";
import { normalizeResumeData } from "@/services/resume/normalize-resume-data";
import { validateParsedResume } from "@/services/resume/validate-parsed-resume";

import { rateLimit } from "@/lib/rate-limit";

/**
 * Transforms binary conversion errors, Gemini model dropouts, schema validation
 * conflicts, or rate limit blocks into standardized JSON API contract footprints.
 */
function handleResumeParseRouteError(error: any, fallbackMessage: string, status = 500) {
  console.error("AI Complex Resume Parsing Route Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("formData") || errorMessage.includes("Multipart")) {
    return NextResponse.json(
      { success: false, error: "Failed to decode multipart form data packet transmission vectors." },
      { status: 400 }
    );
  }
  if (errorMessage.includes("pdf") || errorMessage.includes("extract") || errorMessage.includes("Buffer")) {
    return NextResponse.json(
      { success: false, error: "The document extraction pipeline failed translating unformatted PDF text elements." },
      { status: 422 }
    );
  }
  if (errorMessage.includes("Gemini") || errorMessage.includes("model") || errorMessage.includes("AI")) {
    return NextResponse.json(
      { success: false, error: "The intelligence layer encountered an unexpected context processing drop or structural timeout." },
      { status: 502 }
    );
  }
  if (errorMessage.includes("validation") || errorMessage.includes("Zod") || errorMessage.includes("schema")) {
    return NextResponse.json(
      { success: false, error: "The structured resume parameters failed matching downstream profile validation criteria fields." },
      { status: 422 }
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
        { success: false, error: "Access Denied: Authentication token signature is missing or unauthorized." },
        { status: 401 }
      );
    }

    // 2. Identity Extraction & Rate Limiting Guard
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    
    let limit;
    try {
      limit = rateLimit(`resume-parse:${ip}`, 10, 60_000);
    } catch (limitError) {
      console.error("Rate limit check lookup exception:", limitError);
      limit = { success: true }; // Safe pass sandbox fallguard
    }

    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: "Too many consecutive file processing tasks submitted. Please retry in 60 seconds." },
        { status: 429 }
      );
    }

    // 3. Safe Form Data Packet Extraction
    let formData;
    try {
      formData = await req.formData();
    } catch (formError) {
      return handleResumeParseRouteError(formError, "Failed parsing binary content data packet boundaries.", 400);
    }

    const file = formData.get("file");

    // 4. File Structure Pre-flight Boundary Constraints Check
    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Validation failed: Missing raw resume attachment document parameter 'file'." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Format constraint mismatch: This automation tool exclusively supports PDF document files." },
        { status: 400 }
      );
    }

    // 5. ArrayBuffer Conversion Block
    let buffer: Buffer;
    try {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    } catch (streamError) {
      return handleResumeParseRouteError(streamError, "Failed reading raw underlying payload document memory vectors.", 422);
    }

    // 6. Execution Pipeline Transitions Sandbox
    let normalized;
    try {
      // Step A: Raw OCR Text Extraction
      const text = await extractResumeText(buffer);
      
      if (!text || text.trim() === "") {
        return NextResponse.json(
          { success: false, error: "Ingestion failure: The provided file does not contain searchable or indexable plain-text strings." },
          { status: 422 }
        );
      }

      // Step B: Gemini Cognitive Context Mapping
      const parsed = await mapResumeWithGemini(text);

      // Step C: Schema Structure Alignment Normalization
      normalized = normalizeResumeData(parsed);

      // Step D: Profile Schema Rule Evaluation Constraints Verification
      validateParsedResume(normalized);

    } catch (pipelineError) {
      return handleResumeParseRouteError(pipelineError, "The intelligence parsing pipeline failed to parse the file structure.");
    }

    // 7. Success Output Payload Map Contract Signature
    return NextResponse.json(
      {
        success: true,
        data: normalized,
      },
      { status: 200 }
    );

  } catch (globalCatchError) {
    return handleResumeParseRouteError(globalCatchError, "The file parsing gateway processing thread hit an unhandled core exception.");
  }
}