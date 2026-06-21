import { prisma } from "@/lib/prisma";

export async function getSocialLinks(
  portfolioId: string
) {
  return prisma.socialLink.findMany({
    where: {
      portfolioId,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export async function getSocialLink(
  socialLinkId: string
) {
  return prisma.socialLink.findUnique({
    where: {
      id: socialLinkId,
    },
  });
}

export async function createSocialLink(
  portfolioId: string,
  data: {
    platform: string;
    username?: string;
    url: string;
    iconName?: string;
    iconUrl?: string;
    iconSource?:
      | "LIBRARY"
      | "USER_UPLOAD"
      | "DEFAULT_ICON";
    displayOrder?: number;
  }
) {
  const count =
    await prisma.socialLink.count({
      where: {
        portfolioId,
      },
    });

  return prisma.socialLink.create({
    data: {
      portfolioId,
      platform:
        data.platform,
      username:
        data.username,
      url: data.url,
      iconName:
        data.iconName,
      iconUrl:
        data.iconUrl,
      iconSource:
        data.iconSource,
      displayOrder:
        data.displayOrder ??
        count,
    },
  });
}

export async function updateSocialLink(
  socialLinkId: string,
  data: Record<
    string,
    unknown
  >
) {
  return prisma.socialLink.update({
    where: {
      id: socialLinkId,
    },
    data,
  });
}

export async function deleteSocialLink(
  socialLinkId: string
) {
  return prisma.socialLink.delete({
    where: {
      id: socialLinkId,
    },
  });
}

export async function reorderSocialLinks(
  portfolioId: string,
  socialLinkIds: string[]
) {
  await prisma.$transaction(
    socialLinkIds.map(
      (
        id,
        index
      ) =>
        prisma.socialLink.update({
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