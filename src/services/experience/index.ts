import { prisma } from "@/lib/prisma";

export async function getExperiences(
  portfolioId: string
) {
  return prisma.experience.findMany({
    where: {
      portfolioId,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export async function getExperience(
  experienceId: string
) {
  return prisma.experience.findUnique({
    where: {
      id: experienceId,
    },
  });
}

export async function createExperience(
  portfolioId: string,
  data: {
    company: string;
    position: string;
    employmentType?:
      | "FULL_TIME"
      | "PART_TIME"
      | "INTERNSHIP"
      | "FREELANCE"
      | "CONTRACT";
    location?: string;
    companyWebsite?: string;
    companyBanner?: string;
    companyLogo?: string;
    description?: string;
    responsibilities?: string[];
    technologies?: string[];
    startDate?: Date;
    endDate?: Date;
    currentlyWorking?: boolean;
  }
) {
  const count =
    await prisma.experience.count({
      where: {
        portfolioId,
      },
    });

  return prisma.experience.create({
    data: {
      portfolioId,

      company:
        data.company,

      position:
        data.position,

      employmentType:
        data.employmentType,

      location:
        data.location,

      companyWebsite:
        data.companyWebsite,

      companyBanner:
        data.companyBanner,

      companyLogo:
        data.companyLogo,

      description:
        data.description,

      responsibilities:
        data.responsibilities ??
        [],

      technologies:
        data.technologies ??
        [],

      startDate:
        data.startDate,

      endDate:
        data.endDate,

      currentlyWorking:
        data.currentlyWorking ??
        false,

      displayOrder:
        count,
    },
  });
}

export async function updateExperience(
  experienceId: string,
  data: Record<
    string,
    unknown
  >
) {
  return prisma.experience.update({
    where: {
      id: experienceId,
    },
    data,
  });
}

export async function deleteExperience(
  experienceId: string
) {
  return prisma.experience.delete({
    where: {
      id: experienceId,
    },
  });
}