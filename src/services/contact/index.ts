// src/services/contact/index.ts

import { prisma } from "@/lib/prisma";
import { trackContactRequest } from "@/services/analytics";
import { sendContactEmail } from "@/services/email/send-contact-email";

interface CreateContactMessageInput {
  portfolioId: string;
  visitorName: string;
  visitorEmail: string;
  note?: string;
}

export async function createContactMessage({
  portfolioId,
  visitorName,
  visitorEmail,
  note,
}: CreateContactMessageInput) {
  const portfolio =
    await prisma.portfolio.findUnique({
      where: {
        id: portfolioId,
      },
      select: {
        id: true,
        allowContactForm: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

  if (!portfolio) {
    throw new Error(
      "Portfolio not found"
    );
  }

  if (
    !portfolio.allowContactForm
  ) {
    throw new Error(
      "Contact requests are disabled"
    );
  }

  const oneHourAgo = new Date(
    Date.now() - 60 * 60 * 1000
  );

  const recentMessages =
    await prisma.contactMessage.count({
      where: {
        portfolioId,
        visitorEmail,
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });

  if (recentMessages >= 3) {
    throw new Error(
      "Too many messages. Please try again later."
    );
  }

  const message =
    await prisma.contactMessage.create(
      {
        data: {
          portfolioId,
          visitorName,
          visitorEmail,
          note,
        },
      }
    );

  await trackContactRequest(
    portfolioId
  );

  if (
    portfolio.user?.email
  ) {
    await sendContactEmail({
      ownerEmail:
        portfolio.user.email,
      visitorName,
      visitorEmail,
      subject:
        "New Contact Request",
      message:
        note ??
        "No message provided",
    });
  }

  return {
    success: true,
    data: message,
  };
}

export async function getContactMessages(
  portfolioId: string
) {
  return prisma.contactMessage.findMany(
    {
      where: {
        portfolioId,
      },
      orderBy: {
        createdAt: "desc",
      },
    }
  );
}

export async function markMessageAsSeen(
  messageId: string
) {
  return prisma.contactMessage.update({
    where: {
      id: messageId,
    },
    data: {
      isSeen: true,
      seenAt: new Date(),
    },
  });
}

export async function deleteMessage(
  messageId: string
) {
  return prisma.contactMessage.delete({
    where: {
      id: messageId,
    },
  });
}

export async function getUnreadMessageCount(
  portfolioId: string
) {
  return prisma.contactMessage.count({
    where: {
      portfolioId,
      isSeen: false,
    },
  });
}

export async function deleteExpiredSeenMessages() {
  const oneDayAgo = new Date(
    Date.now() - 24 * 60 * 60 * 1000
  );

  const result =
    await prisma.contactMessage.deleteMany({
      where: {
        isSeen: true,
        seenAt: {
          lt: oneDayAgo,
        },
      },
    });

  return {
    deleted: result.count,
  };
}