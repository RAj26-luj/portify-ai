"use server";

import { prisma } from "@/lib/prisma";

export async function createProject(
  data: {
    portfolioId: string;
    title: string;
    description: string;
    techStack: string[];
  }
) {
  return prisma.project.create({
    data,
  });
}

export async function updateProject(
  id: string,
  data: Record<string, unknown>
) {
  return prisma.project.update({
    where: { id },
    data,
  });
}

export async function deleteProject(
  id: string
) {
  return prisma.project.delete({
    where: { id },
  });
}