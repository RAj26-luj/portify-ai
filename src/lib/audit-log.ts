import { NotificationType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Meta = Record<
  string,
  unknown
>;

export async function createAuditLog(
  action: string,
  userId: string,
  metadata: Meta = {},
  type: NotificationType = NotificationType.INFO
) {
  try {
    return await prisma.notification.create(
      {
        data: {
          userId,
          title: action,
          message:
            JSON.stringify(
              {
                action,
                timestamp:
                  new Date().toISOString(),
                ...metadata,
              }
            ),
          type,
        },
      }
    );
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