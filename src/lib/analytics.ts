import { prisma } from "./prisma";

type ViewData = {
  portfolioId: string;
  ipHash?: string;
  country?: string;
  city?: string;
  browser?: string;
  device?: string;
  referrer?: string;
};

export async function incrementView(
  data: ViewData
) {
  const existing =
    data.ipHash
      ? await prisma.portfolioView.findFirst(
          {
            where: {
              portfolioId:
                data.portfolioId,
              ipHash:
                data.ipHash,
            },
          }
        )
      : null;

  await prisma.portfolioView.create(
    {
      data: {
        portfolioId:
          data.portfolioId,
        ipHash:
          data.ipHash,
        country:
          data.country,
        city: data.city,
        browser:
          data.browser,
        device:
          data.device,
        referrer:
          data.referrer,
        expiresAt:
          new Date(
            Date.now() +
              1000 *
                60 *
                60 *
                24 *
                30
          ),
      },
    }
  );

  await prisma.portfolio.update({
    where: {
      id: data.portfolioId,
    },
    data: {
      totalViews: {
        increment: 1,
      },
      ...(existing
        ? {}
        : {
            uniqueVisitors:
              {
                increment: 1,
              },
          }),
    },
  });
}