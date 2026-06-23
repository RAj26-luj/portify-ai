"use server";

import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

// Error
function handleNotificationServerError(error: any, fallbackMessage: string) {
  console.error("Notification Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return {
      success: false,
      error: "The real-time alert engine is temporarily executing system syncs. Please try again.",
    };
  }
  return { success: false, error: fallbackMessage };
}

export async function createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
}) {
  try {
    if (!data.userId) {
      return {
        success: false,
        error: "Recipient user identity token parameter string is required.",
      };
    }
    if (!data.title) {
      return { success: false, error: "Alert notification summary title cannot be empty." };
    }

    const result = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type ?? NotificationType.INFO,
      },
    });
    return { success: true, data: result };
  } catch (error) {
    return handleNotificationServerError(
      error,
      "Failed to broadcast notification dispatcher signal event."
    );
  }
}

export async function getNotifications(userId: string) {
  try {
    if (!userId) {
      return {
        success: false,
        error: "Missing user identification reference code context.",
        data: [],
      };
    }

    const data = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed compiling complete notification logs archive:", error);
    return {
      success: false,
      error: "Unable to assemble your notifications log stream feed.",
      data: [],
    };
  }
}

export async function getUnreadNotifications(userId: string) {
  try {
    if (!userId) {
      return {
        success: false,
        error: "Missing user identification reference code context.",
        data: [],
      };
    }

    const data = await prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to extract pending system inbox items stream:", error);
    return {
      success: false,
      error: "Could not filter down active unread notification stack elements.",
      data: [],
    };
  }
}

export async function getUnreadCount(userId: string) {
  try {
    if (!userId) {
      return { success: true, data: 0 };
    }

    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
    return { success: true, data: count };
  } catch (error) {
    console.error("Error executing math logic loops on unread badge aggregates:", error);
    return {
      success: false,
      error: "Failed to resolve active alert badge counters structure layouts.",
      data: 0,
    };
  }
}

export async function markAsRead(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Unique message item reference mapping tracker is required.",
      };
    }

    const result = await prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    return { success: true, data: result };
  } catch (error) {
    return handleNotificationServerError(
      error,
      "Failed to clear selected individual unread metric flags index."
    );
  }
}

export async function markAllAsRead(userId: string) {
  try {
    if (!userId) {
      return {
        success: false,
        error: "Target profile account identity reference token is missing.",
      };
    }

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    return { success: true, data: result };
  } catch (error) {
    return handleNotificationServerError(
      error,
      "Failed to execute batch modifications on unread items feed."
    );
  }
}

export async function deleteNotification(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Target alert notification item tracking signature is required.",
      };
    }

    const result = await prisma.notification.delete({
      where: {
        id,
      },
    });
    return { success: true, data: result };
  } catch (error) {
    return handleNotificationServerError(
      error,
      "The specified alert row index ledger row could not be successfully cleared."
    );
  }
}
