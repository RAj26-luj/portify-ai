import { prisma } from "@/lib/prisma";
import { PortfolioStatus } from "@prisma/client";

export async function getOrCreatePortfolio(user: any) {
  if (!user?.id) throw new Error("No userId");

  return await prisma.portfolio.upsert({
    where: {
      userId: user.id,
    },
    update: {},
    create: {
      userId: user.id,
      username: user.username,
      slug: `${user.username}-${Date.now()}-${Math.floor(
        Math.random() * 1000000
      )}`,
      title: user.name || "",
      status: PortfolioStatus.DRAFT,
      isPublic: false,
    },
  });
}