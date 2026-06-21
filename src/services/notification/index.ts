import { prisma } from "@/lib/prisma";
import {
  NotificationType,
} from "@prisma/client";

export async function getNotifications(
  userId: string
) {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt:
        "desc",
    },
  });
}

export async function getUnreadNotifications(
  userId: string
) {
  return prisma.notification.findMany({
    where: {
      userId,
      isRead: false,
    },
    orderBy: {
      createdAt:
        "desc",
    },
  });
}

export async function getNotification(
  notificationId: string
) {
  return prisma.notification.findUnique({
    where: {
      id: notificationId,
    },
  });
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationType =
    NotificationType.INFO
) {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
    },
  });
}

export async function markNotificationAsRead(
  notificationId: string
) {
  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isRead: true,
      readAt:
        new Date(),
    },
  });
}

export async function markAllNotificationsAsRead(
  userId: string
) {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt:
        new Date(),
    },
  });
}

export async function deleteNotification(
  notificationId: string
) {
  return prisma.notification.delete({
    where: {
      id: notificationId,
    },
  });
}

export async function clearReadNotifications(
  userId: string
) {
  return prisma.notification.deleteMany({
    where: {
      userId,
      isRead: true,
    },
  });
}

export async function getNotificationCount(
  userId: string
) {
  const total =
    await prisma.notification.count({
      where: {
        userId,
      },
    });

  const unread =
    await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

  return {
    total,
    unread,
  };
}