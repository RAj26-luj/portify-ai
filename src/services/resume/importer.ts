import { prisma } from "@/lib/prisma";
import type { ParsedResume } from "@/types/resume";

function detectPortfolioCategory(
  data: ParsedResume
):
  | "STUDENT"
  | "WORKING_PROFESSIONAL"
  | "FREELANCER"
  | "RESEARCHER"
  | "STARTUP_FOUNDER" {
  const experienceText =
    (
      data.experience ?? []
    )
      .map(
        (item) =>
          `${item.position ?? ""} ${item.company ?? ""} ${item.description ?? ""}`
      )
      .join(" ")
      .toLowerCase();

  if (
    experienceText.includes(
      "founder"
    ) ||
    experienceText.includes(
      "co-founder"
    ) ||
    experienceText.includes(
      "startup"
    ) ||
    experienceText.includes(
      "ceo"
    )
  ) {
    return "STARTUP_FOUNDER";
  }

  if (
    experienceText.includes(
      "freelance"
    ) ||
    experienceText.includes(
      "freelancer"
    ) ||
    experienceText.includes(
      "self employed"
    )
  ) {
    return "FREELANCER";
  }

  if (
    experienceText.includes(
      "research"
    ) ||
    experienceText.includes(
      "publication"
    ) ||
    experienceText.includes(
      "journal"
    )
  ) {
    return "RESEARCHER";
  }

  if (
    (data.experience ?? [])
      .length === 0 &&
    (data.education ?? [])
      .length > 0
  ) {
    return "STUDENT";
  }

  return "WORKING_PROFESSIONAL";
}

function getCategoryDefaults(
  category:
    | "STUDENT"
    | "WORKING_PROFESSIONAL"
    | "FREELANCER"
    | "RESEARCHER"
    | "STARTUP_FOUNDER"
) {
  switch (category) {
    case "STUDENT":
      return {
        tagline:
          "Student Portfolio",
      };

    case "WORKING_PROFESSIONAL":
      return {
        tagline:
          "Professional Portfolio",
      };

    case "FREELANCER":
      return {
        tagline:
          "Freelance Portfolio",
      };

    case "RESEARCHER":
      return {
        tagline:
          "Research Portfolio",
      };

    case "STARTUP_FOUNDER":
      return {
        tagline:
          "Founder Portfolio",
      };

    default:
      return {};
  }
}

function validateCategory(
  category:
    | "STUDENT"
    | "WORKING_PROFESSIONAL"
    | "FREELANCER"
    | "RESEARCHER"
    | "STARTUP_FOUNDER",
  data: ParsedResume
) {
  if (
    category ===
      "RESEARCHER" &&
    data.projects.length ===
      0
  ) {
    throw new Error(
      "Researcher portfolios require at least one project or publication"
    );
  }

  if (
    category ===
      "STARTUP_FOUNDER" &&
    data.experience.length ===
      0
  ) {
    throw new Error(
      "Founder portfolios require experience information"
    );
  }
}

export async function importResumeData(
  portfolioId: string,
  data: ParsedResume
) {
  const category =
    detectPortfolioCategory(
      data
    );

  const defaults =
    getCategoryDefaults(
      category
    );

  validateCategory(
    category,
    data
  );

  await prisma.$transaction(
    async (tx) => {
      await tx.portfolio.update({
        where: {
          id: portfolioId,
        },
        data: {
          bio:
            data.bio ??
            undefined,

          category,

          ...defaults,
        },
      });

      await Promise.all([
        tx.skill.deleteMany({
          where: {
            portfolioId,
          },
        }),

        tx.education.deleteMany({
          where: {
            portfolioId,
          },
        }),

        tx.experience.deleteMany({
          where: {
            portfolioId,
          },
        }),

        tx.project.deleteMany({
          where: {
            portfolioId,
          },
        }),
      ]);

      if (
        data.skills?.length
      ) {
        await tx.skill.createMany(
          {
            data:
              data.skills.map(
                (
                  name,
                  index
                ) => ({
                  portfolioId,
                  name,
                  displayOrder:
                    index,
                })
              ),
          }
        );
      }

      if (
        data.education?.length
      ) {
        await tx.education.createMany(
          {
            data:
              data.education.map(
                (
                  item
                ) => ({
                  portfolioId,
                  institution:
                    item.institution ??
                    "Unknown",
                  degree:
                    item.degree ??
                    "Unknown",
                  startDate:
                    item.startDate
                      ? new Date(
                          item.startDate
                        )
                      : null,
                  endDate:
                    item.endDate
                      ? new Date(
                          item.endDate
                        )
                      : null,
                })
              ),
          }
        );
      }

      if (
        data.experience?.length
      ) {
        await tx.experience.createMany(
          {
            data:
              data.experience.map(
                (
                  item
                ) => ({
                  portfolioId,
                  company:
                    item.company ??
                    "Unknown",
                  position:
                    item.position ??
                    "Unknown",
                  description:
                    item.description ??
                    "",
                })
              ),
          }
        );
      }

      if (
        data.projects?.length
      ) {
        await tx.project.createMany(
          {
            data:
              data.projects.map(
                (
                  item,
                  index
                ) => ({
                  portfolioId,
                  title:
                    item.title ??
                    "Project",
                  description:
                    item.description ??
                    "",
                  techStack:
                    item.techStack ??
                    [],
                  imageUrls:
                    [],
                  displayOrder:
                    index,
                })
              ),
          }
        );
      }
    }
  );

  return true;
}