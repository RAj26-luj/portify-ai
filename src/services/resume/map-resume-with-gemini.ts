import { generateJson } from "@/lib/gemini";

import { RESUME_PARSER_PROMPT } from "@/prompts/resume-parser";

import type { ParsedResume } from "@/types/parsed-resume";

export async function mapResumeWithGemini(
  resumeText: string
): Promise<ParsedResume> {
  if (!resumeText.trim()) {
    throw new Error("Resume text is empty");
  }

  try {
    return await generateJson<ParsedResume>(`
${RESUME_PARSER_PROMPT}

RESUME:

${resumeText}
`);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to map resume with AI"
    );
  }
}