import { prisma } from "@/lib/prisma";

export async function cleanupExpiredTokens() {
  await prisma.verificationToken.deleteMany(
    {
      where: {
        expires: {
          lt: new Date(),
        },
      },
    }
  );
}

export async function cleanupOldViews() {
  await prisma.portfolioView.deleteMany(
    {
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    }
  );
}