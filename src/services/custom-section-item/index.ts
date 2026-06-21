import { prisma } from "@/lib/prisma";

export async function getCustomSectionItems(
  customSectionId: string
) {
  return prisma.customSectionItem.findMany({
    where: {
      customSectionId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCustomSectionItem(
  id: string
) {
  return prisma.customSectionItem.findUnique({
    where: {
      id,
    },
  });
}

export async function createCustomSectionItem(
  customSectionId: string,
  data: {
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    iconUrl?: string;
    attachmentUrl?: string;
    externalUrl?: string;
  }
) {
  return prisma.customSectionItem.create({
    data: {
      customSectionId,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      imageUrl: data.imageUrl,
      iconUrl: data.iconUrl,
      attachmentUrl: data.attachmentUrl,
      externalUrl: data.externalUrl,
    },
  });
}

export async function updateCustomSectionItem(
  id: string,
  data: {
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    iconUrl?: string;
    attachmentUrl?: string;
    externalUrl?: string;
  }
) {
  return prisma.customSectionItem.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteCustomSectionItem(
  id: string
) {
  return prisma.customSectionItem.delete({
    where: {
      id,
    },
  });
}