import { prisma } from "@/lib/prisma";
import type { ParsedResume } from "@/types/resume";

export async function importResumeData(
  portfolioId: string,
  data: ParsedResume
) {
  if (data.bio) {
    await prisma.portfolio.update({
      where: {
        id: portfolioId,
      },
      data: {
        bio: data.bio,
      },
    });
  }

  await prisma.skill.deleteMany({
    where: {
      portfolioId,
    },
  });

  await prisma.education.deleteMany({
    where: {
      portfolioId,
    },
  });

  await prisma.experience.deleteMany({
    where: {
      portfolioId,
    },
  });

  await prisma.project.deleteMany({
    where: {
      portfolioId,
    },
  });

  if (data.skills.length) {
    await prisma.skill.createMany({
      data: data.skills.map(
        (name, index) => ({
          portfolioId,
          name,
          displayOrder: index,
        })
      ),
    });
  }

  if (data.education.length) {
    await prisma.education.createMany({
      data: data.education.map(
        (item) => ({
          portfolioId,
          institution:
            item.institution ??
            "Unknown",

          degree:
            item.degree ??
            "Unknown",
        })
      ),
    });
  }

  if (data.experience.length) {
    await prisma.experience.createMany({
      data: data.experience.map(
        (item) => ({
          portfolioId,
          company:
            item.company ??
            "Unknown",

          position:
            item.position ??
            "Unknown",

          description:
            item.description,
        })
      ),
    });
  }

  if (data.projects.length) {
    await prisma.project.createMany({
      data: data.projects.map(
        (item, index) => ({
          portfolioId,

          title:
            item.title ??
            "Project",

          description:
            item.description ??
            "",

          techStack:
            item.techStack ?? [],

          imageUrls: [],

          displayOrder:
            index,
        })
      ),
    });
  }

  return true;
}