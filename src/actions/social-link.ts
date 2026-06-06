"use server";

import { prisma } from "@/lib/prisma";

export async function createSocialLink(
  data: {
    portfolioId: string;
    platform: string;
    url: string;
    label?: string;
  }
) {
  return prisma.socialLink.create({
    data,
  });
}

export async function deleteSocialLink(
  id: string
) {
  return prisma.socialLink.delete({
    where: { id },
  });
}