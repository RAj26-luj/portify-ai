import { prisma } from "@/lib/prisma";

export async function getSkills(
  portfolioId: string
) {
  return prisma.skill.findMany({
    where: {
      portfolioId,
    },
    include: {
      category: true,
    },
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });
}

export async function getSkill(
  skillId: string
) {
  return prisma.skill.findUnique({
    where: {
      id: skillId,
    },
    include: {
      category: true,
    },
  });
}

export async function createSkill(
  portfolioId: string,
  data: {
    categoryId?: string;
    name: string;
    proficiency?:
      | "BEGINNER"
      | "INTERMEDIATE"
      | "ADVANCED"
      | "EXPERT";
    yearsOfExperience?: number;
    iconName?: string;
    iconUrl?: string;
    iconSource?:
      | "LIBRARY"
      | "USER_UPLOAD"
      | "DEFAULT_ICON";
    description?: string;
    tag?: string;
  }
) {
  const count =
    await prisma.skill.count({
      where: {
        portfolioId,
      },
    });

  return prisma.skill.create({
    data: {
      portfolioId,
      categoryId:
        data.categoryId,
      name: data.name,
      proficiency:
        data.proficiency,
      yearsOfExperience:
        data.yearsOfExperience,
      iconName:
        data.iconName,
      iconUrl:
        data.iconUrl,
      iconSource:
        data.iconSource ??
        "LIBRARY",
      description:
        data.description,
      tag: data.tag,
      displayOrder:
        count,
    },
  });
}

export async function updateSkill(
  skillId: string,
  data: Record<
    string,
    unknown
  >
) {
  return prisma.skill.update({
    where: {
      id: skillId,
    },
    data,
  });
}

export async function deleteSkill(
  skillId: string
) {
  return prisma.skill.delete({
    where: {
      id: skillId,
    },
  });
}

export async function reorderSkills(
  portfolioId: string,
  skillIds: string[]
) {
  await prisma.$transaction(
    skillIds.map(
      (
        id,
        index
      ) =>
        prisma.skill.update({
          where: {
            id,
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

export async function getSkillCategories(
  portfolioId: string
) {
  return prisma.skillCategory.findMany({
    where: {
      portfolioId,
    },
    include: {
      skills: {
        orderBy: {
          displayOrder:
            "asc",
        },
      },
    },
    orderBy: {
      displayOrder:
        "asc",
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