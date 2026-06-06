"use server";

import { fillPortfolio } from "@/services/resume/fill-portfolio";

export async function applyParsedResume(
  portfolioId: string,
  data: unknown
) {
  return fillPortfolio(
    portfolioId,
    data as never
  );
}