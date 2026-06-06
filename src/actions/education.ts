"use server";

import { prisma } from "@/lib/prisma";

export async function createEducation(
  data: {
    portfolioId: string;
    institution: string;
    degree: string;
  }
) {
  return prisma.education.create({
    data,
  });
}

export async function deleteEducation(
  id: string
) {
  return prisma.education.delete({
    where: { id },
  });
}