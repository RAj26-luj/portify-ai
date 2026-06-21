import { prisma } from "@/lib/prisma";

export async function getCodingProfiles(
  portfolioId: string
) {
  return prisma.codingProfile.findMany({
    where: {
      portfolioId,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export async function getCodingProfile(
  codingProfileId: string
) {
  return prisma.codingProfile.findUnique({
    where: {
      id: codingProfileId,
    },
  });
}

export async function createCodingProfile(
  portfolioId: string,
  data: {
    platform: string;
    username: string;
    profileUrl: string;
    iconName?: string;
    iconUrl?: string;
    currentRating?: number;
    maxRating?: number;
    rank?: string;
    globalRank?: string;
    problemsSolved?: number;
    contestsAttended?: number;
    activeSince?: string;
  }
) {
  const count =
    await prisma.codingProfile.count({
      where: {
        portfolioId,
      },
    });

  return prisma.codingProfile.create({
    data: {
      portfolioId,
      platform: data.platform,
      username: data.username,
      profileUrl: data.profileUrl,
      iconName: data.iconName,
      iconUrl: data.iconUrl,
      currentRating:
        data.currentRating,
      maxRating:
        data.maxRating,
      rank: data.rank,
      globalRank:
        data.globalRank,
      problemsSolved:
        data.problemsSolved,
      contestsAttended:
        data.contestsAttended,
      activeSince:
        data.activeSince,
      displayOrder: count,
    },
  });
}

export async function updateCodingProfile(
  codingProfileId: string,
  data: Record<
    string,
    unknown
  >
) {
  return prisma.codingProfile.update({
    where: {
      id: codingProfileId,
    },
    data,
  });
}

export async function deleteCodingProfile(
  codingProfileId: string
) {
  return prisma.codingProfile.delete({
    where: {
      id: codingProfileId,
    },
  });
}

export async function reorderCodingProfiles(
  portfolioId: string,
  codingProfileIds: string[]
) {
  await prisma.$transaction(
    codingProfileIds.map(
      (
        id,
        index
      ) =>
        prisma.codingProfile.update({
          where: {
            id,
            portfolioId,
          },
          data: {
            displayOrder:
              index,
          },
        })
    )
  );

  return {
    success: true,
  };
}