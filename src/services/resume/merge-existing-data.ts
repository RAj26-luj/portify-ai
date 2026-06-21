import type { ParsedResume } from "@/types/parsed-resume";

export function mergeExistingData(
  existing: ParsedResume,
  incoming: ParsedResume
): ParsedResume {
  return {
    profile: {
      ...existing.profile,
      ...Object.fromEntries(
        Object.entries(incoming.profile ?? {}).filter(
          ([, value]) =>
            value !== undefined &&
            value !== null &&
            value !== ""
        )
      ),
    },

    skills:
      incoming.skills.length > 0
        ? incoming.skills
        : existing.skills,

    education:
      incoming.education.length > 0
        ? incoming.education
        : existing.education,

    experience:
      incoming.experience.length > 0
        ? incoming.experience
        : existing.experience,

    projects:
      incoming.projects.length > 0
        ? incoming.projects
        : existing.projects,

    certifications:
      incoming.certifications.length > 0
        ? incoming.certifications
        : existing.certifications,

    publications:
      incoming.publications.length > 0
        ? incoming.publications
        : existing.publications,

    achievements:
      incoming.achievements.length > 0
        ? incoming.achievements
        : existing.achievements,

    socialLinks:
      incoming.socialLinks.length > 0
        ? incoming.socialLinks
        : existing.socialLinks,

    codingProfiles:
      incoming.codingProfiles.length > 0
        ? incoming.codingProfiles
        : existing.codingProfiles,

    openSource:
      incoming.openSource.length > 0
        ? incoming.openSource
        : existing.openSource,

    customSections:
      (incoming.customSections?.length ?? 0) > 0
        ? incoming.customSections
        : existing.customSections,
  };
}