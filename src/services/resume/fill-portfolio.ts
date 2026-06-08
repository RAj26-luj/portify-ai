import { prisma } from "@/lib/prisma";
import type { ParsedResume } from "@/types/resume";

export async function fillPortfolio(
  portfolioId: string,
  data: ParsedResume
) {
  await prisma.$transaction(
    async (tx) => {
      await tx.skill.deleteMany({
        where: {
          portfolioId,
        },
      });

      await tx.education.deleteMany(
        {
          where: {
            portfolioId,
          },
        }
      );

      await tx.experience.deleteMany(
        {
          where: {
            portfolioId,
          },
        }
      );

      await tx.project.deleteMany({
        where: {
          portfolioId,
        },
      });

      await tx.portfolio.update({
        where: {
          id: portfolioId,
        },
        data: {
          bio:
            data.bio ??
            undefined,
        },
      });

      if (
        data.skills?.length
      ) {
        await tx.skill.createMany(
          {
            data:
              data.skills.map(
                (
                  skill
                ) => ({
                  portfolioId,
                  name: skill,
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
                  education
                ) => ({
                  portfolioId,
                  institution:
                    education.institution ??
                    "",
                  degree:
                    education.degree ??
                    "",
                  startDate:
                    education.startDate
                      ? new Date(
                          education.startDate
                        )
                      : null,
                  endDate:
                    education.endDate
                      ? new Date(
                          education.endDate
                        )
                      : null,
                })
              ),
          }
        );
      }

      for (const experience of data.experience ??
        []) {
        await tx.experience.create(
          {
            data: {
              portfolioId,
              company:
                experience.company ??
                "",
              position:
                experience.position ??
                "",
              description:
                experience.description ??
                "",
            },
          }
        );
      }

      for (const project of data.projects ??
        []) {
        await tx.project.create(
          {
            data: {
              portfolioId,
              title:
                project.title ??
                "",
              description:
                project.description ??
                "",
              techStack:
                project.techStack ??
                [],
              imageUrls:
                [],
            },
          }
        );
      }
    }
  );

  return true;
}