"use server";

import { extractResumeText } from "@/services/resume/extract-resume-text";
import { mapResumeWithGemini } from "@/services/resume/map-resume-with-gemini";
import { normalizeResumeData } from "@/services/resume/normalize-resume-data";
import { validateParsedResume } from "@/services/resume/validate-parsed-resume";

import type { ParsedResume } from "@/types/parsed-resume";

// Error
function handleResumeParserServerError(error: any, fallbackMessage: string) {
  console.error("Resume Extraction Processing Pipeline Server Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("Resume file is required")) {
    return {
      success: false,
      error:
        "Document submission rejected: A valid PDF or docx file object parameter must be provided.",
    };
  }
  if (
    errorMessage.includes("extract") ||
    errorMessage.includes("text") ||
    errorMessage.includes("pdf")
  ) {
    return {
      success: false,
      error:
        "Document conversion failure: The structural content of this file could not be read or extracted safely.",
    };
  }
  if (
    errorMessage.includes("Gemini") ||
    errorMessage.includes("map") ||
    errorMessage.includes("AI")
  ) {
    return {
      success: false,
      error:
        "Cognitive parsing failure: The AI model encountered a validation block analyzing the parsed text.",
    };
  }
  if (
    errorMessage.includes("validate") ||
    errorMessage.includes("invalid") ||
    errorMessage.includes("normalization")
  ) {
    return {
      success: false,
      error:
        "Data schema check failed: The extracted resume structure does not align with core profile model rules.",
    };
  }
  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return {
      success: false,
      error:
        "The structural data engine encountered a synchronization issue saving mapping artifacts.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function parseResume(file: File): Promise<any> {
  try {
    if (!file) {
      return {
        success: false,
        error: "Document parsing rejected. Please upload an actual binary resume file asset.",
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let resumeText = "";
    try {
      resumeText = await extractResumeText(buffer);
    } catch (extractError) {
      return handleResumeParserServerError(
        extractError,
        "Unable to pull plain text strings out of your file formatting."
      );
    }

    let parsed: any;
    try {
      parsed = await mapResumeWithGemini(resumeText);
    } catch (aiError) {
      return handleResumeParserServerError(
        aiError,
        "Portify AI intelligence engine was unable to safely map unstructured data profiles."
      );
    }

    let normalized: ParsedResume;
    try {
      normalized = normalizeResumeData(parsed);
    } catch (normError) {
      return handleResumeParserServerError(
        normError,
        "Data conversion logic failed matching structural properties on normalized entities mapping layers."
      );
    }

    try {
      validateParsedResume(normalized);
    } catch (valError) {
      return handleResumeParserServerError(
        valError,
        "The file configuration schema validation rejected the parsed entity arrays format configurations rules."
      );
    }

    return {
      success: true,
      data: normalized,
    };
  } catch (error) {
    return handleResumeParserServerError(
      error,
      "The automated resume profile extraction processing pipeline crashed unexpectedly."
    );
  }
}
