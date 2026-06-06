"use server";

import { prisma } from "@/lib/prisma";

export async function createExperience(
  data: {
    portfolioId: string;
    company: string;
    position: string;
  }
) {
  return prisma.experience.create({
    data,
  });
}

export async function deleteExperience(
  id: string
) {
  return prisma.experience.delete({
    where: { id },
  });
}