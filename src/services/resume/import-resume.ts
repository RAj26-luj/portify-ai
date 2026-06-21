import { prisma } from "@/lib/prisma";

import { missingFieldEngine } from "@/services/resume/missing-field-engine";
import { upsertAchievements } from "@/services/resume/upsert-achievements";
import { upsertCertifications } from "@/services/resume/upsert-certifications";
import { upsertCodingProfiles } from "@/services/resume/upsert-coding-profiles";
import { upsertCustomSections } from "@/services/resume/upsert-custom-sections";
import { upsertEducations } from "@/services/resume/upsert-educations";
import { upsertExperiences } from "@/services/resume/upsert-experiences";
import { upsertOpenSource } from "@/services/resume/upsert-open-source";
import { upsertPortfolio } from "@/services/resume/upsert-portfolio";
import { upsertProjectMetrics } from "@/services/resume/upsert-project-metrics";
import { upsertProjects } from "@/services/resume/upsert-projects";
import { upsertPublications } from "@/services/resume/upsert-publications";
import { upsertResumeVersion } from "@/services/resume/upsert-resume-version";
import { upsertSkillCategories } from "@/services/resume/upsert-skill-categories";
import { upsertSkills } from "@/services/resume/upsert-skills";
import { upsertSocialLinks } from "@/services/resume/upsert-social-links";

import type { ParsedResume } from "@/types/parsed-resume";

export async function importResume(
  portfolioId: string,
  resume: ParsedResume,
  fileName?: string,
  fileUrl?: string
) {
  if (fileName && fileUrl) {
    await upsertResumeVersion({
  portfolioId,
  fileName,
  fileUrl,
});
  }

  await upsertPortfolio(
    portfolioId,
    resume
  );

  await upsertSkillCategories(
    portfolioId,
    resume
  );

  await upsertSkills(
    portfolioId,
    resume
  );

  await upsertEducations(
    portfolioId,
    resume
  );

  await upsertExperiences(
    portfolioId,
    resume
  );

  await upsertProjects(
    portfolioId,
    resume
  );

  await upsertProjectMetrics(
    portfolioId,
    resume
  );

  await upsertCertifications(
    portfolioId,
    resume
  );

  await upsertPublications(
    portfolioId,
    resume
  );

  await upsertAchievements(
    portfolioId,
    resume
  );

  await upsertSocialLinks(
    portfolioId,
    resume
  );

  await upsertCodingProfiles(
    portfolioId,
    resume
  );

  await upsertOpenSource(
    portfolioId,
    resume
  );

  await upsertCustomSections(
    portfolioId,
    resume
  );

  const analysis =
    missingFieldEngine(resume);

  await prisma.portfolio.update({
    where: {
      id: portfolioId,
    },
    data: {
      completionScore:
        analysis.completionScore,
      pendingFields:
        analysis.missingFields,
      pendingQuestions:
        analysis.pendingQuestions,
      profileCompleted:
        analysis.profileCompleted,
      onboardingCompleted:
        analysis.profileCompleted,
      publishReady:
        analysis.publishReady,
      lastAnalyzedAt: new Date(),
    },
  });

  return {
    success: true,
    analysis,
  };
}