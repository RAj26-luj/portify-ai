"use server";

import { prisma } from "@/lib/prisma";

export async function createSkill(
  portfolioId: string,
  name: string,
  category?: string
) {
  return prisma.skill.create({
    data: {
      portfolioId,
      name,
      category,
    },
  });
}

export async function deleteSkill(
  id: string
) {
  return prisma.skill.delete({
    where: {
      id,
    },
  });
}