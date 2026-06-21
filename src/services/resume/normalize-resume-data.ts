import type { ParsedResume } from "@/types/parsed-resume";

function clean(value?: string | null) {
  return value?.trim() ?? "";
}

export function normalizeResumeData(
  rawData: any
): ParsedResume {
  const data = {
    ...rawData,

    profile: {
      ...rawData.profile,

      fullName:
        rawData.profile?.fullName ??
        rawData.profile?.name ??
        "",
    },

    education:
      rawData.education ??
      rawData.educations ??
      [],

    experience:
      rawData.experience ??
      rawData.experiences ??
      [],

    openSource:
      rawData.openSource ??
      rawData.openSourceProjects ??
      [],
  };

  return {
    ...data,

    profile: {
      ...data.profile,

      fullName: clean(
        data.profile?.fullName
      ),

      headline: clean(
        data.profile?.headline
      ),

      email: clean(
        data.profile?.email
      ),

      phone: clean(
        data.profile?.phone
      ),

      website: clean(
        data.profile?.website
      ),

      location: clean(
        data.profile?.location
      ),

      city: clean(
        data.profile?.city
      ),

      state: clean(
        data.profile?.state
      ),

      country: clean(
        data.profile?.country
      ),

      summary: clean(
        data.profile?.summary
      ),

      bio: clean(
        data.profile?.bio
      ),

      currentRole: clean(
        data.profile?.currentRole
      ),

      profileImage: clean(
        data.profile?.profileImage
      ),

      coverImage: clean(
        data.profile?.coverImage
      ),

      resumeHeadline: clean(
        data.profile?.resumeHeadline
      ),

      availabilityStatus: clean(
        data.profile?.availabilityStatus
      ),

      currentFocus: clean(
        data.profile?.currentFocus
      ),
    },

    skills:
      data.skills?.filter(
        (skill: any) =>
          skill.name?.trim()
      ) ?? [],

    education:
      data.education?.filter(
        (education: any) =>
          education.institution?.trim()
      ) ?? [],

    experience:
      data.experience?.filter(
        (experience: any) =>
          experience.company?.trim()
      ) ?? [],

    projects:
      data.projects?.filter(
        (project: any) =>
          project.title?.trim()
      ) ?? [],

    certifications:
      data.certifications?.filter(
        (certification: any) =>
          certification.name?.trim()
      ) ?? [],

    publications:
      data.publications?.filter(
        (publication: any) =>
          publication.title?.trim()
      ) ?? [],

    achievements:
      data.achievements?.filter(
        (achievement: any) =>
          achievement.title?.trim()
      ) ?? [],

    socialLinks:
      data.socialLinks?.filter(
        (link: any) =>
          link.platform?.trim()
      ) ?? [],

    codingProfiles:
      data.codingProfiles?.filter(
        (profile: any) =>
          profile.platform?.trim()
      ) ?? [],

    openSource:
      data.openSource?.filter(
        (project: any) =>
          project.repositoryName?.trim()
      ) ?? [],

    customSections:
      data.customSections?.filter(
        (section: any) =>
          section.title?.trim()
      ) ?? [],
  };
}