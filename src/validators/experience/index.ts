// src/actions/experience.ts

"use server";

import { prisma } from "@/lib/prisma";

export async function createExperience(
  data: {
    portfolioId: string;
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

    displayOrder?: number;
  }
) {
  return prisma.experience.create({
    data: {
      portfolioId:
        data.portfolioId,

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
        data.displayOrder ??
        0,
    },
  });
}

export async function updateExperience(
  id: string,
  data: {
    company?: string;
    position?: string;

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

    displayOrder?: number;
  }
) {
  return prisma.experience.update({
    where: {
      id,
    },
    data,
  });
}

export async function getExperiences(
  portfolioId: string
) {
  return prisma.experience.findMany({
    where: {
      portfolioId,
    },
    orderBy: [
      {
        displayOrder:
          "asc",
      },
      {
        createdAt:
          "desc",
      },
    ],
  });
}

export async function getExperienceById(
  id: string
) {
  return prisma.experience.findUnique({
    where: {
      id,
    },
  });
}

export async function deleteExperience(
  id: string
) {
  return prisma.experience.delete({
    where: {
      id,
    },
  });
}