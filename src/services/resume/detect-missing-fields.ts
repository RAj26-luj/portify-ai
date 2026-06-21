import type { ParsedResume } from "@/types/parsed-resume";

export function detectMissingFields(
  resume: ParsedResume
): string[] {
  const missing: string[] = [];

  if (!resume.profile.profileImage) {
    missing.push("profileImage");
  }

  if (!resume.profile.resumeHeadline) {
    missing.push("resumeHeadline");
  }

  if (
    !resume.profile.bio &&
    !resume.profile.summary
  ) {
    missing.push("bio");
  }

  if (!resume.skills.length) {
    missing.push("skills");
  }

  if (!resume.education.length) {
    missing.push("education");
  }

  if (!resume.experience.length) {
    missing.push("experience");
  }

  if (!resume.projects.length) {
    missing.push("projects");
  } else {
    const hasMissingDescription =
      resume.projects.some(
        (project) =>
          !project.description &&
          !project.shortDescription
      );

    if (hasMissingDescription) {
      missing.push("projectDescription");
    }
  }

  const hasGithub =
    resume.socialLinks.some(
      (link) =>
        link.platform
          .toLowerCase()
          .includes("github")
    ) ||
    resume.codingProfiles.some(
      (profile) =>
        profile.platform
          .toLowerCase()
          .includes("github")
    );

  if (!hasGithub) {
    missing.push("github");
  }

  const hasLinkedin =
    resume.socialLinks.some(
      (link) =>
        link.platform
          .toLowerCase()
          .includes("linkedin")
    );

  if (!hasLinkedin) {
    missing.push("linkedin");
  }

  if (!resume.socialLinks.length) {
    missing.push("socialLinks");
  }

  if (!resume.codingProfiles.length) {
    missing.push("codingProfiles");
  }

  return [...new Set(missing)];
}