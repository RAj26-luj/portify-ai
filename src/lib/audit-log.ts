import {
  NotificationType,
} from "@prisma/client";


import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
type Meta = Record<
  string,
  unknown
>;

export async function createAuditLog(
  action: string,
  userId?: string,
  metadata: Meta = {},
  type: NotificationType =
    NotificationType.INFO
) {
  try {
    const log =
    await prisma.auditLog.create({
  data: {
    userId,
    action,
    entityType:
      metadata.entityType?.toString() ??
      "SYSTEM",
    entityId:
      metadata.entityId?.toString(),

    metadata:
      JSON.parse(
        JSON.stringify(metadata)
      ) as Prisma.InputJsonValue,
  },
});
      

    if (userId) {
      await prisma.notification.create(
        {
          data: {
            userId,
            title: action,
            message:
              JSON.stringify(
                metadata
              ),
            type,
          },
        }
      );
    }

    return log;
  } catch {
    return null;
  }
}

export async function logLogin(
  userId: string,
  metadata: Meta = {}
) {
  return createAuditLog(
    "LOGIN",
    userId,
    metadata,
    NotificationType.SUCCESS
  );
}

export async function logRegistration(
  userId: string,
  metadata: Meta = {}
) {
  return createAuditLog(
    "REGISTRATION",
    userId,
    metadata,
    NotificationType.SUCCESS
  );
}

export async function logPasswordReset(
  userId: string,
  metadata: Meta = {}
) {
  return createAuditLog(
    "PASSWORD_RESET",
    userId,
    metadata,
    NotificationType.WARNING
  );
}

export async function logUserApproval(
  userId: string,
  metadata: Meta = {}
) {
  return createAuditLog(
    "USER_APPROVED",
    userId,
    metadata,
    NotificationType.SUCCESS
  );
}

export async function logUserRejected(
  userId: string,
  metadata: Meta = {}
) {
  return createAuditLog(
    "USER_REJECTED",
    userId,
    metadata,
    NotificationType.ERROR
  );
}

export async function logUserBlocked(
  userId: string,
  metadata: Meta = {}
) {
  return createAuditLog(
    "USER_BLOCKED",
    userId,
    metadata,
    NotificationType.ERROR
  );
}

export async function logPortfolioUpdate(
  userId: string,
  metadata: Meta = {}
) {
  return createAuditLog(
    "PORTFOLIO_UPDATED",
    userId,
    metadata
  );
}

export async function logResumeImport(
  userId: string,
  metadata: Meta = {}
) {
  return createAuditLog(
    "RESUME_IMPORTED",
    userId,
    metadata,
    NotificationType.SUCCESS
  );
}

export async function logThemeChange(
  userId: string,
  metadata: Meta = {}
) {
  return createAuditLog(
    "THEME_CHANGED",
    userId,
    metadata
  );
}

export async function logAccountDelete(
  userId: string,
  metadata: Meta = {}
) {
  return createAuditLog(
    "ACCOUNT_DELETED",
    userId,
    metadata,
    NotificationType.ERROR
  );
}