import { parseResumeText } from "@/services/ai";
import type { ParsedResume } from "@/types/resume";

export async function parseResumeWithAI(
  text: string
): Promise<ParsedResume> {
  const response =
    await parseResumeText(text);

  try {
    return JSON.parse(
      response
    ) as ParsedResume;
  } catch {
    return {
      skills: [],
      education: [],
      experience: [],
      projects: [],
    };
  }
}