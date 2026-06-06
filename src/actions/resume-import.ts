"use server";

import { importResumeData } from "@/services/resume/importer";
import type { ParsedResume } from "@/types/resume";

export async function importResume(
  portfolioId: string,
  data: ParsedResume
) {
  return importResumeData(
    portfolioId,
    data
  );
}