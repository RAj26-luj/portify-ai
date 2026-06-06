"use server";

import { prisma } from "@/lib/prisma";

export async function createAchievement(
  data: {
    portfolioId: string;
    title: string;
  }
) {
  return prisma.achievement.create({
    data,
  });
}

export async function deleteAchievement(
  id: string
) {
  return prisma.achievement.delete({
    where: { id },
  });
}