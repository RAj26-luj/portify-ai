"use server";

import { prisma } from "@/lib/prisma";

export async function getUserById(
  id: string
) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function blockUser(
  id: string
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      isBlocked: true,
    },
  });
}

export async function unblockUser(
  id: string
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      isBlocked: false,
    },
  });
}