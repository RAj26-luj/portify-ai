import type { ParsedResume } from "@/types/parsed-resume";

export function validateParsedResume(
  data: ParsedResume
): ParsedResume {
  if (!data) {
    throw new Error("Parsed resume is required");
  }

  if (!data.profile) {
    throw new Error("Profile section is required");
  }

  if (!Array.isArray(data.skills)) {
    throw new Error("Skills must be an array");
  }

  if (!Array.isArray(data.education)) {
    throw new Error("Education must be an array");
  }

  if (!Array.isArray(data.experience)) {
    throw new Error("Experience must be an array");
  }

  if (!Array.isArray(data.projects)) {
    throw new Error("Projects must be an array");
  }

  if (!Array.isArray(data.certifications)) {
    throw new Error("Certifications must be an array");
  }

  if (!Array.isArray(data.publications)) {
    throw new Error("Publications must be an array");
  }

  if (!Array.isArray(data.achievements)) {
    throw new Error("Achievements must be an array");
  }

  if (!Array.isArray(data.socialLinks)) {
    throw new Error("Social links must be an array");
  }

  if (!Array.isArray(data.codingProfiles)) {
    throw new Error("Coding profiles must be an array");
  }

  if (!Array.isArray(data.openSource)) {
    throw new Error("Open source projects must be an array");
  }

  return data;
}