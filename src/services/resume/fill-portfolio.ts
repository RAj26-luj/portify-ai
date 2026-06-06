import { prisma } from "@/lib/prisma";
import type { ParsedResume } from "@/types/resume";

export async function fillPortfolio(
  portfolioId: string,
  data: ParsedResume
) {
  if (data.skills?.length) {
    await prisma.skill.createMany({
      data: data.skills.map(
        (skill) => ({
          portfolioId,
          name: skill,
        })
      ),
    });
  }

  return true;
}