"use server";

import { prisma } from "@/lib/prisma";

export async function createCodingProfile(
  data: {
    portfolioId: string;
    platform: string;
    username: string;
    profileUrl: string;
  }
) {
  return prisma.codingProfile.create({
    data,
  });
}

export async function deleteCodingProfile(
  id: string
) {
  return prisma.codingProfile.delete({
    where: { id },
  });
}