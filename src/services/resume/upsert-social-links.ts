import { prisma } from "@/lib/prisma";

import type { ParsedResume } from "@/types/parsed-resume";

export async function upsertSocialLinks(
  portfolioId: string,
  resume: ParsedResume
) {
  if (!resume.socialLinks.length) {
    return [];
  }

  const results = [];

  for (const [
    index,
    socialLink,
  ] of resume.socialLinks.entries()) {
    const existing =
      await prisma.socialLink.findFirst({
        where: {
          portfolioId,
          platform: socialLink.platform,
        },
      });

    if (existing) {
      results.push(existing);
      continue;
    }

    const created =
      await prisma.socialLink.create({
        data: {
          portfolioId,
          platform:
            socialLink.platform,
          username:
            socialLink.username,
          url: socialLink.url,
          displayOrder: index,
        },
      });

    results.push(created);
  }

  return results;
}