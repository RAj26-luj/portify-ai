import { parseResumeText } from "@/services/ai";
import type { ParsedResume } from "@/types/resume";

function extractJson(
  text: string
) {
  const start =
    text.indexOf("{");

  const end =
    text.lastIndexOf("}");

  if (
    start === -1 ||
    end === -1
  ) {
    return "{}";
  }

  return text.slice(
    start,
    end + 1
  );
}

export async function parseResumeWithAI(
  text: string
): Promise<ParsedResume> {
  const response =
    await parseResumeText(text);

  try {
    const parsed =
      JSON.parse(
        extractJson(
          response
        )
      );

    return {
      name:
        parsed.name ?? "",
      email:
        parsed.email ?? "",
      phone:
        parsed.phone ?? "",
      bio:
        parsed.bio ?? "",

      skills:
        Array.isArray(
          parsed.skills
        )
          ? parsed.skills
          : [],

      education:
        Array.isArray(
          parsed.education
        )
          ? parsed.education
          : [],

      experience:
        Array.isArray(
          parsed.experience
        )
          ? parsed.experience
          : [],

      projects:
        Array.isArray(
          parsed.projects
        )
          ? parsed.projects
          : [],
    };
  } catch {
    return {
      name: "",
      email: "",
      phone: "",
      bio: "",
      skills: [],
      education: [],
      experience: [],
      projects: [],
    };
  }
}