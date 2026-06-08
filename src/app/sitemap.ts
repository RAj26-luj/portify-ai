export const dynamic = "force-dynamic";

import type {
  MetadataRoute,
} from "next";

import { prisma } from "@/lib/prisma";
export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {
  const url =
    process.env
      .NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const portfolios =
    await prisma.portfolio.findMany(
      {
        where: {
          isPublic: true,
        },

        select: {
          username: true,
          updatedAt: true,
        },
      }
    );

  return [
    {
      url,
      lastModified:
        new Date(),
    },

    ...portfolios.map(
      (
        portfolio: { username: string; updatedAt: Date }
      ) => ({
        url:
          `${url}/portfolio/${portfolio.username}`,

        lastModified:
          portfolio.updatedAt,
      })
    ),
  ];
}