import { prisma } from "@/lib/prisma";

export async function createAchievement(data: {
  portfolioId: string;
  title: string;
  description?: string | null;
  issuer?: string | null;
  featured?: boolean;
  achievementDate?: Date | null;
  certificateUrl?: string | null;
  imageUrl?: string | null;
  rank?: string | null;
  position?: string | null;
  displayOrder?: number;
}) {
  return prisma.achievement.create({
    data: {
      portfolioId: data.portfolioId,
      title: data.title,
      description: data.description,
      issuer: data.issuer,
      featured: data.featured ?? false,
      achievementDate: data.achievementDate,
      certificateUrl: data.certificateUrl,
      imageUrl: data.imageUrl,
      rank: data.rank,
      position: data.position,
      displayOrder: data.displayOrder ?? 0,
    },
  });
}

export async function updateAchievement(
  id: string,
  data: {
    title?: string;
    description?: string | null;
    issuer?: string | null;
    featured?: boolean;
    achievementDate?: Date | null;
    certificateUrl?: string | null;
    imageUrl?: string | null;
    rank?: string | null;
    position?: string | null;
    displayOrder?: number;
  }
) {
  return prisma.achievement.update({
    where: { id },
    data,
  });
}

export async function getAchievements(
  portfolioId: string
) {
  return prisma.achievement.findMany({
    where: {
      portfolioId,
    },
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getAchievementById(
  id: string
) {
  return prisma.achievement.findUnique({
    where: {
      id,
    },
  });
}

export async function deleteAchievement(
  id: string
) {
  return prisma.achievement.delete({
    where: {
      id,
    },
  });
}