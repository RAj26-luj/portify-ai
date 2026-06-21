import { prisma } from "@/lib/prisma";

export async function getEducations(
  portfolioId: string
) {
  return prisma.education.findMany({
    where: {
      portfolioId,
    },
    orderBy: {
      displayOrder:
        "asc",
    },
  });
}

export async function getEducation(
  educationId: string
) {
  return prisma.education.findUnique({
    where: {
      id: educationId,
    },
  });
}

export async function createEducation(
  portfolioId: string,
  data: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    grade?: string;
    cgpa?: string;
    institutionImage?: string;
    location?: string;
    startDate?: Date;
    endDate?: Date;
    currentlyStudying?: boolean;
    description?: string;
    logoUrl?: string;
  }
) {
  const count =
    await prisma.education.count({
      where: {
        portfolioId,
      },
    });

  return prisma.education.create({
    data: {
      portfolioId,
      institution:
        data.institution,
      degree:
        data.degree,
      fieldOfStudy:
        data.fieldOfStudy,
      grade:
        data.grade,
      cgpa:
        data.cgpa,
      institutionImage:
        data.institutionImage,
      location:
        data.location,
      startDate:
        data.startDate,
      endDate:
        data.endDate,
      currentlyStudying:
        data.currentlyStudying ??
        false,
      description:
        data.description,
      logoUrl:
        data.logoUrl,
      displayOrder:
        count,
    },
  });
}

export async function updateEducation(
  educationId: string,
  data: Record<
    string,
    unknown
  >
) {
  return prisma.education.update({
    where: {
      id: educationId,
    },
    data,
  });
}

export async function deleteEducation(
  educationId: string
) {
  return prisma.education.delete({
    where: {
      id: educationId,
    },
  });
}

export async function reorderEducations(
  portfolioId: string,
  educationIds: string[]
) {
  await prisma.$transaction(
    educationIds.map(
      (
        id,
        index
      ) =>
        prisma.education.update({
          where: {
            id,
            portfolioId,
          },
          data: {
            displayOrder:
              index,
          },
        })
    )
  );

  return {
    success: true,
  };
}