import { prisma } from "@/lib/prisma";

export async function getCustomSections(
  portfolioId: string
) {
  return prisma.customSection.findMany({
    where: {
      portfolioId,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export async function getCustomSection(
  customSectionId: string
) {
  return prisma.customSection.findUnique({
    where: {
      id: customSectionId,
    },
  });
}

export async function createCustomSection(
  portfolioId: string,
  data: {
    title: string;
    subtitle?: string;
    description?: string;
    richTextContent?: string;
    imageUrl?: string;
    galleryImages?: string[];
    attachments?: string[];
    buttonText?: string;
    buttonUrl?: string;
    iconUrl?: string;
    sectionType?: string;
    isVisible?: boolean;
    displayOrder?: number;
  }
) {
  const count =
    await prisma.customSection.count({
      where: {
        portfolioId,
      },
    });

  return prisma.customSection.create({
    data: {
      portfolioId,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      richTextContent: data.richTextContent,
      imageUrl: data.imageUrl,
      galleryImages: data.galleryImages ?? [],
      attachments: data.attachments ?? [],
      buttonText: data.buttonText,
      buttonUrl: data.buttonUrl,
      iconUrl: data.iconUrl,
      sectionType: data.sectionType,
      isVisible: data.isVisible ?? true,
      displayOrder: data.displayOrder ?? count,
    },
  });
}

export async function updateCustomSection(
  customSectionId: string,
  data: {
    title?: string;
    subtitle?: string;
    description?: string;
    richTextContent?: string;
    imageUrl?: string;
    galleryImages?: string[];
    attachments?: string[];
    buttonText?: string;
    buttonUrl?: string;
    iconUrl?: string;
    sectionType?: string;
    isVisible?: boolean;
    displayOrder?: number;
  }
) {
  return prisma.customSection.update({
    where: {
      id: customSectionId,
    },
    data,
  });
}

export async function deleteCustomSection(
  customSectionId: string
) {
  return prisma.customSection.delete({
    where: {
      id: customSectionId,
    },
  });
}

export async function reorderCustomSections(
  portfolioId: string,
  customSectionIds: string[]
) {
  await prisma.$transaction(
    customSectionIds.map(
      (
        id,
        index
      ) =>
        prisma.customSection.update({
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