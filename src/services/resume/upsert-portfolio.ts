import { prisma } from "@/lib/prisma";

import type { ParsedResume } from "@/types/parsed-resume";

export async function upsertPortfolio(
  portfolioId: string,
  resume: ParsedResume
) {
  const profile = resume.profile;

  return prisma.portfolio.update({
    where: {
      id: portfolioId,
    },
    data: {
      title: profile.fullName,
      tagline: profile.headline,
      bio: profile.bio ?? profile.summary,
      email: profile.email,
      phone: profile.phone,
      website: profile.website,
      city: profile.city,
      state: profile.state,
      country: profile.country,
      currentRole: profile.currentRole,
      profileImage: profile.profileImage,
      coverImage: profile.coverImage,
      resumeHeadline: profile.resumeHeadline,
      availabilityStatus:
        profile.availabilityStatus,
      currentFocus: profile.currentFocus,
      description: profile.summary,
    },
  });
}