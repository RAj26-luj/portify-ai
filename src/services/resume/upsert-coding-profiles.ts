import { prisma } from "@/lib/prisma";

import type { ParsedResume } from "@/types/parsed-resume";

export async function upsertCodingProfiles(
  portfolioId: string,
  resume: ParsedResume
) {
  if (!resume.codingProfiles.length) {
    return [];
  }

  const results = [];

  for (const [
    index,
    profile,
  ] of resume.codingProfiles.entries()) {
    const existing =
      await prisma.codingProfile.findFirst({
        where: {
          portfolioId,
          platform: profile.platform,
        },
      });

    if (existing) {
      results.push(existing);
      continue;
    }

    const created =
      await prisma.codingProfile.create({
        data: {
          portfolioId,
          platform: profile.platform,
          username: profile.username,
          profileUrl: profile.profileUrl,
          currentRating:
            profile.currentRating,
          maxRating:
            profile.maxRating,
          rank: profile.rank,
          globalRank:
            profile.globalRank,
          problemsSolved:
            profile.problemsSolved,
          contestsAttended:
            profile.contestsAttended,
          displayOrder: index,
        },
      });

    results.push(created);
  }

  return results;
}