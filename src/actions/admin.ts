"use server";

import { prisma } from "@/lib/prisma";

export async function getPendingUsers() {
  return prisma.user.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}