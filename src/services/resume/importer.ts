import { prisma } from "@/lib/prisma";
import type { ParsedResume } from "@/types/resume";

export async function importResumeData(
  portfolioId: string,
  data: ParsedResume
) {
  await prisma.$transaction(
    async (tx) => {
      if (data.bio) {
        await tx.portfolio.update({
          where: {
            id: portfolioId,
          },
          data: {
            bio: data.bio,
          },
        });
      }

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