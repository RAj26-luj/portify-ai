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
  username: string
) {
  return prisma.portfolio.create({
    data: {
      userId,
      username,
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
  }
) {
  return prisma.portfolio.update({
    where: {
      id: portfolioId,
    },
    data,
  });
}