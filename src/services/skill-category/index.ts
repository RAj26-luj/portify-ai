import { prisma } from "@/lib/prisma";

export async function getSkillCategories(
  portfolioId: string
) {
  return prisma.skillCategory.findMany({
    where: {
      portfolioId,
    },
    include: {
      skills: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export async function getSkillCategory(
  categoryId: string
) {
  return prisma.skillCategory.findUnique({
    where: {
      id: categoryId,
    },
    include: {
      skills: true,
    },
  });
}

export async function createSkillCategory(
  portfolioId: string,
  data: {
    name: string;
    displayOrder?: number;
  }
) {
  const count =
    await prisma.skillCategory.count({
      where: {
        portfolioId,
      },
    });

  return prisma.skillCategory.create({
    data: {
      portfolioId,
      name: data.name,
      displayOrder:
        data.displayOrder ??
        count,
    },
  });
}

export async function updateSkillCategory(
  categoryId: string,
  data: {
    name?: string;
    displayOrder?: number;
  }
) {
  return prisma.skillCategory.update({
    where: {
      id: categoryId,
    },
    data,
  });
}

export async function deleteSkillCategory(
  categoryId: string
) {
  await prisma.skill.updateMany({
    where: {
      categoryId,
    },
    data: {
      categoryId: null,
    },
  });

  return prisma.skillCategory.delete({
    where: {
      id: categoryId,
    },
  });
}

export async function reorderSkillCategories(
  portfolioId: string,
  categoryIds: string[]
) {
  await prisma.$transaction(
    categoryIds.map(
      (
        id,
        index
      ) =>
        prisma.skillCategory.update({
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