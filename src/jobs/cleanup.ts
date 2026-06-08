import { prisma } from "@/lib/prisma";

export async function cleanupExpiredTokens() {
  const result =
    await prisma.verificationToken.deleteMany(
      {
        where: {
          expires: {
            lt: new Date(),
          },
        },
      }
    );

  return result.count;
}

export async function cleanupOldViews() {
  const result =
    await prisma.portfolioView.deleteMany(
      {
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      }
    );

  return result.count;
}

export async function cleanupReadNotifications() {
  const result =
    await prisma.notification.deleteMany(
      {
        where: {
          isRead: true,
          createdAt: {
            lt: new Date(
              Date.now() -
                1000 *
                  60 *
                  60 *
                  24 *
                  30
            ),
          },
        },
      }
    );

  return result.count;
}
export async function cleanupRejectedUsers() {
  const result =
    await prisma.user.deleteMany({
      where: {
        status:
          "REJECTED",
        emailVerified:
          null,
        createdAt: {
          lt: new Date(
            Date.now() -
              1000 *
                60 *
                60 *
                24 *
                30
          ),
        },
      },
    });

  return result.count;
}
export async function runCleanupJobs() {
const [
  tokens,
  views,
  notifications,
  rejectedUsers,
] = await Promise.all([
  cleanupExpiredTokens(),
  cleanupOldViews(),
  cleanupReadNotifications(),
  cleanupRejectedUsers(),
]);

return {
  tokens,
  views,
  notifications,
  rejectedUsers,
};
}
