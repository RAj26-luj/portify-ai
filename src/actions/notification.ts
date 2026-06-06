"use server";

import { prisma } from "@/lib/prisma";

export async function createNotification(
  userId: string,
  title: string,
  message: string
) {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
    },
  });
}

export async function markAsRead(
  id: string
) {
  return prisma.notification.update({
    where: {
      id,
    },
    data: {
      isRead: true,
    },
  });
}