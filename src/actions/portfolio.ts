"use server";

import { prisma } from "@/lib/prisma";

export async function getPortfolioByUserId(
  userId: string
) {
  return prisma.portfolio.findUnique({
    where: {
      userId,
    },
    include: {
      resume: true,
      projects: true,
      educations: true,
      experiences: true,
      skills: true,
      achievements: true,
      socialLinks: true,
      codingProfiles: true,
      themes: true,
      analytics: true,
    },
  });
}

export async function getPortfolioByUsername(
  username: string
) {
  return prisma.portfolio.findUnique({
    where: {
      username,
    },
    include: {
      resume: true,
      projects: true,
      educations: true,
      experiences: true,
      skills: true,
      achievements: true,
      socialLinks: true,
      codingProfiles: true,
      themes: true,
      analytics: true,
    },
  });
}

export async function createPortfolio(
  userId: string,
  username: string,
  category:
    | "STUDENT"
    | "WORKING_PROFESSIONAL"
    | "FREELANCER"
    | "RESEARCHER"
    | "STARTUP_FOUNDER" = "STUDENT"
) {
  return prisma.portfolio.create({
    data: {
      userId,
      username,
      category,
    },
  });
}

export async function updatePortfolio(
  portfolioId: string,
 data: {
  title?: string;
  tagline?: string;
  bio?: string;

  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogTitle?: string;
ogSubtitle?: string;
ogDescription?: string;
  category?:
    | "STUDENT"
    | "WORKING_PROFESSIONAL"
    | "FREELANCER"
    | "RESEARCHER"
    | "STARTUP_FOUNDER";

  allowContactForm?: boolean;
  allowResumeDownload?: boolean;

  showSkills?: boolean;
  showProjects?: boolean;
  showEducation?: boolean;
  showExperience?: boolean;
  showAchievements?: boolean;

  showSocialLinks?: boolean;
  showCodingProfiles?: boolean;

  showCustomSections?: boolean;

  showAnalytics?: boolean;
}
) {
  return prisma.portfolio.update({
    where: {
      id: portfolioId,
    },
    data,
  });
}
export async function exportPortfolio(
  portfolioId: string
) {
  return prisma.portfolio.findUnique({
    where: {
      id: portfolioId,
    },

    include: {
      resume: true,

      projects: true,

      educations: true,

      experiences: true,

      skills: true,

      achievements: true,

      socialLinks: true,

      codingProfiles: true,

      customSections: true,

      themes: true,

      analytics: true,

      views: true,

      contactMessages: true,
    },
  });
}