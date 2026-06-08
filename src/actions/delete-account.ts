"use server";

import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit-log";

export async function deleteAccount(
  userId: string
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        portfolio: true,
      },
    });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  await createAuditLog(
    "ACCOUNT_DELETED",
    userId,
    {
      email:
        user.email,
    }
  );

  if (user.portfolio) {
    await prisma.contactMessage.deleteMany(
      {
        where: {
          portfolioId:
            user.portfolio.id,
        },
      }
    );

    await prisma.portfolioView.deleteMany(
      {
        where: {
          portfolioId:
            user.portfolio.id,
        },
      }
    );

    await prisma.skill.deleteMany({
      where: {
        portfolioId:
          user.portfolio.id,
      },
    });

    await prisma.education.deleteMany(
      {
        where: {
          portfolioId:
            user.portfolio.id,
        },
      }
    );

    await prisma.experience.deleteMany(
      {
        where: {
          portfolioId:
            user.portfolio.id,
        },
      }
    );

    await prisma.project.deleteMany(
      {
        where: {
          portfolioId:
            user.portfolio.id,
        },
      }
    );

    await prisma.achievement.deleteMany(
      {
        where: {
          portfolioId:
            user.portfolio.id,
        },
      }
    );

    await prisma.socialLink.deleteMany(
      {
        where: {
          portfolioId:
            user.portfolio.id,
        },
      }
    );

    await prisma.codingProfile.deleteMany(
      {
        where: {
          portfolioId:
            user.portfolio.id,
        },
      }
    );

    await prisma.customSection.deleteMany(
      {
        where: {
          portfolioId:
            user.portfolio.id,
        },
      }
    );

    await prisma.theme.deleteMany({
      where: {
        portfolioId:
          user.portfolio.id,
      },
    });

    await prisma.resume.deleteMany({
      where: {
        portfolioId:
          user.portfolio.id,
      },
    });

    await prisma.analytics.deleteMany(
      {
        where: {
          portfolioId:
            user.portfolio.id,
        },
      }
    );

    await prisma.portfolio.delete({
      where: {
        id:
          user.portfolio.id,
      },
    });
  }

  await prisma.notification.deleteMany(
    {
      where: {
        userId,
      },
    }
  );

  await prisma.account.deleteMany({
    where: {
      userId,
    },
  });
  await prisma.verificationToken.deleteMany(
  {
    where: {
      identifier:
        user.email,
    },
  }
);

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return {
    success: true,
  };
}