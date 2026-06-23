import { prisma } from "@/lib/prisma";
import { PortfolioStatus } from "@prisma/client";

export async function getPortfolio(userId: string) {
  if (!userId) return null;

  return prisma.portfolio.findUnique({
    where: {
      userId,
    },
    include: {
      resume: true,
      analytics: true,
      themePreference: true,
      sectionSettings: {
        orderBy: { displayOrder: "asc" },
      },
      skills: {
        orderBy: { displayOrder: "asc" },
      },
      projects: {
        orderBy: { displayOrder: "asc" },
      },
      experiences: {
        orderBy: { displayOrder: "asc" },
      },
      educations: {
        orderBy: { displayOrder: "asc" },
      },
      certifications: {
        orderBy: { displayOrder: "asc" },
      },
      publications: {
        orderBy: { displayOrder: "asc" },
      },
      achievements: {
        orderBy: { displayOrder: "asc" },
      },
      codingProfiles: {
        orderBy: { displayOrder: "asc" },
      },
      socialLinks: {
        orderBy: { displayOrder: "asc" },
      },
      testimonials: {
        orderBy: { displayOrder: "asc" },
      },
      openSourceProjects: {
        orderBy: { displayOrder: "asc" },
      },
      customSections: {
        orderBy: { displayOrder: "asc" },
      },
      media: true,
    },
  });
}

/**
 * SAFE: always ensures portfolio exists
 */
export async function getOrCreatePortfolio(userId: string, username: string) {
  if (!userId) return null;

  let portfolio = await prisma.portfolio.findUnique({
    where: { userId },
  });

  if (!portfolio) {
    portfolio = await prisma.portfolio.create({
      data: {
        userId,
        username,
        title: "",
        status: PortfolioStatus.DRAFT,
        isPublic: false,
        sectionSettings: {
          create: [
            {
              sectionKey: "hero",
              title: "Hero",
              mandatory: true,
              isEnabled: true,
              displayOrder: 0,
            },
            {
              sectionKey: "about",
              title: "About",
              mandatory: true,
              isEnabled: true,
              displayOrder: 1,
            },
            {
              sectionKey: "experience",
              title: "Experience",
              isEnabled: true,
              displayOrder: 2,
            },
            {
              sectionKey: "education",
              title: "Education",
              isEnabled: true,
              displayOrder: 3,
            },
            {
              sectionKey: "skills",
              title: "Skills",
              isEnabled: true,
              displayOrder: 4,
            },
            {
              sectionKey: "projects",
              title: "Projects",
              isEnabled: true,
              displayOrder: 5,
            },
            {
              sectionKey: "opensource",
              title: "Open Source",
              isEnabled: true,
              displayOrder: 6,
            },
            {
              sectionKey: "achievements",
              title: "Achievements",
              isEnabled: true,
              displayOrder: 7,
            },
            {
              sectionKey: "certifications",
              title: "Certifications",
              isEnabled: true,
              displayOrder: 8,
            },
            {
              sectionKey: "publications",
              title: "Publications",
              isEnabled: true,
              displayOrder: 9,
            },
            {
              sectionKey: "testimonials",
              title: "Testimonials",
              isEnabled: true,
              displayOrder: 10,
            },
            {
              sectionKey: "codingprofiles",
              title: "Coding Profiles",
              isEnabled: true,
              displayOrder: 11,
            },
            {
              sectionKey: "sociallinks",
              title: "Social Links",
              isEnabled: true,
              displayOrder: 12,
            },
            {
              sectionKey: "contact",
              title: "Contact",
              mandatory: true,
              isEnabled: true,
              displayOrder: 999,
            },
          ],
        },
        analytics: {
          create: {},
        },
        themePreference: {
          create: {},
        },
      },
    });
  }

  return portfolio;
}

export async function getPortfolioByUsername(username: string) {
  return prisma.portfolio.findFirst({
    where: {
      OR: [{ username }, { slug: username }],
    },
    include: {
      user: true,
      analytics: true,
      themePreference: true,
      skills: true,
      projects: true,
      experiences: true,
      educations: true,
      achievements: true,
      certifications: true,
      publications: true,
      codingProfiles: true,
      socialLinks: true,
      testimonials: true,
      customSections: true,
      openSourceProjects: true,
      media: true,
      resume: true,
      sectionSettings: true,
    },
  });
}

export async function updatePortfolio(portfolioId: string, data: Record<string, unknown>) {
  return prisma.portfolio.update({
    where: { id: portfolioId },
    data,
  });
}

export async function publishPortfolio(portfolioId: string) {
  return prisma.portfolio.update({
    where: { id: portfolioId },
    data: {
      status: PortfolioStatus.PUBLISHED,
      isPublic: true,
      publishedAt: new Date(),
      publishReady: true,
    },
  });
}

export async function unpublishPortfolio(portfolioId: string) {
  return prisma.portfolio.update({
    where: { id: portfolioId },
    data: {
      status: PortfolioStatus.DRAFT,
      isPublic: false,
    },
  });
}

export async function deletePortfolio(portfolioId: string) {
  return prisma.portfolio.delete({
    where: { id: portfolioId },
  });
}

export async function getPortfolioCompletion(userId: string) {
  const portfolio = await prisma.portfolio.findUnique({
    where: { userId },
    include: {
      skills: true,
      projects: true,
      experiences: true,
      educations: true,
      socialLinks: true,
      codingProfiles: true,
    },
  });

  if (!portfolio) return 0;

  let score = 0;

  if (portfolio.bio) score += 15;
  if (portfolio.profileImage) score += 10;
  if (portfolio.skills.length) score += 15;
  if (portfolio.projects.length) score += 20;
  if (portfolio.educations.length) score += 10;
  if (portfolio.experiences.length) score += 10;
  if (portfolio.socialLinks.length) score += 10;
  if (portfolio.codingProfiles.length) score += 10;

  return Math.min(score, 100);
}
