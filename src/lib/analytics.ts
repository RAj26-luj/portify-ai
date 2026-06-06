import { prisma } from "./prisma";

export async function incrementView(
  portfolioId: string
) {
  await prisma.portfolio.update({
    where: {
      id: portfolioId,
    },
    data: {
      totalViews: {
        increment: 1,
      },
    },
  });
}