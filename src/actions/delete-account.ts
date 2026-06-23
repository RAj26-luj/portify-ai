"use server";

import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit-log";

// Error
function handleDeleteAccountServerError(error: any, fallbackMessage: string) {
  console.error("Account Destructor Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("User not found")) {
    return {
      success: false,
      error: "The account targeted for deletion could not be located in our records.",
    };
  }
  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return {
      success: false,
      error: "The data wiping pipeline encountered a structural locking timeout. Please try again.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function deleteAccount(userId: string) {
  try {
    if (!userId) {
      return { success: false, error: "Account identifier token parameter string is required." };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        portfolio: true,
      },
    });

    if (!user) {
      return { success: false, error: "Account lookup failed. The user record does not exist." };
    }

    const portfolioId = user.portfolio?.id;

    try {
      await createAuditLog("ACCOUNT_DELETED", userId, {
        email: user.email,
      });
    } catch (auditError) {
      console.error(
        "Non-blocking audit configuration sequence registration exception:",
        auditError
      );
    }

    await prisma.passwordResetToken.deleteMany({
      where: {
        email: user.email,
      },
    });

    await prisma.verificationToken.deleteMany({
      where: {
        identifier: user.email,
      },
    });

    await prisma.notification.deleteMany({
      where: {
        userId,
      },
    });

    await prisma.emailLog.deleteMany({
      where: {
        userId,
      },
    });

    await prisma.auditLog.deleteMany({
      where: {
        userId,
      },
    });

    await prisma.approvalRequest.deleteMany({
      where: {
        userId,
      },
    });

    await prisma.account.deleteMany({
      where: {
        userId,
      },
    });

    await prisma.report.deleteMany({
      where: {
        OR: [
          {
            reportedUserId: userId,
          },
          ...(portfolioId
            ? [
                {
                  portfolioId,
                },
              ]
            : []),
        ],
      },
    });

    if (portfolioId) {
      await prisma.portfolioSnapshot.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.themeHistory.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.resumeVersion.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.resumeDownload.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.portfolioView.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.projectClick.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.contactMessage.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.analytics.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.themePreference.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.sectionSetting.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.media.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.project.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.education.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.experience.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.skill.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.skillCategory.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.achievement.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.certification.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.publication.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.testimonial.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.socialLink.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.codingProfile.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.customSectionItem.deleteMany({
        where: {
          customSection: {
            portfolioId,
          },
        },
      });

      await prisma.customSection.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.openSourceTimeline.deleteMany({
        where: {
          openSource: {
            portfolioId,
          },
        },
      });

      await prisma.openSourceProject.deleteMany({
        where: {
          portfolioId,
        },
      });

      await prisma.resume.deleteMany({
        where: {
          portfolioId,
        },
      });
    }

    await prisma.$transaction(async (tx) => {
      if (portfolioId) {
        await tx.portfolio.delete({
          where: {
            id: portfolioId,
          },
        });
      }

      await tx.user.delete({
        where: {
          id: userId,
        },
      });
    });

    return {
      success: true,
    };
  } catch (error) {
    return handleDeleteAccountServerError(
      error,
      "Failed to successfully close out user database registries during profile removal."
    );
  }
}
