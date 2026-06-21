"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getPortfolioId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      portfolio: true,
    },
  });

  if (!user?.portfolio?.id) {
    throw new Error("Portfolio not found");
  }

  return user.portfolio.id;
}