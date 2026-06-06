import { prisma } from "@/lib/prisma";

export async function createAuditLog(
  action: string,
  userId: string,
  metadata?: Record<
    string,
    unknown
  >
) {
  try {
    return await prisma.notification.create(
      {
        data: {
          userId,
          title: action,
          message:
            JSON.stringify(
              metadata ?? {}
            ),
        },
      }
    );
  } catch {
    return null;
  }
}