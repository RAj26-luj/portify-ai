import { prisma } from "@/lib/prisma";

export async function getPublications(
  portfolioId: string
) {
  return prisma.publication.findMany({
    where: {
      portfolioId,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export async function getPublication(
  publicationId: string
) {
  return prisma.publication.findUnique({
    where: {
      id: publicationId,
    },
  });
}

export async function createPublication(
  portfolioId: string,
  data: {
    title: string;
    journal?: string;
    featured?: boolean;
    publisher?: string;
    publicationDate?: Date;
    doi?: string;
    citations?: number;
    abstract?: string;
    publicationUrl?: string;
    pdfUrl?: string;
    conference?: string;
    publicationCover?: string;
    authors?: string[];
    displayOrder?: number;
  }
) {
  const count =
    await prisma.publication.count({
      where: {
        portfolioId,
      },
    });

  return prisma.publication.create({
    data: {
      portfolioId,
      title: data.title,
      journal: data.journal,
      featured:
        data.featured ?? false,
      publisher:
        data.publisher,
      publicationDate:
        data.publicationDate,
      doi: data.doi,
      citations:
        data.citations,
      abstract:
        data.abstract,
      publicationUrl:
        data.publicationUrl,
      pdfUrl:
        data.pdfUrl,
      conference:
        data.conference,
      publicationCover:
        data.publicationCover,
      authors:
        data.authors ?? [],
      displayOrder:
        data.displayOrder ??
        count,
    },
  });
}

export async function updatePublication(
  publicationId: string,
  data: {
    title?: string;
    journal?: string;
    featured?: boolean;
    publisher?: string;
    publicationDate?: Date;
    doi?: string;
    citations?: number;
    abstract?: string;
    publicationUrl?: string;
    pdfUrl?: string;
    conference?: string;
    publicationCover?: string;
    authors?: string[];
    displayOrder?: number;
  }
) {
  return prisma.publication.update({
    where: {
      id: publicationId,
    },
    data,
  });
}

export async function deletePublication(
  publicationId: string
) {
  return prisma.publication.delete({
    where: {
      id: publicationId,
    },
  });
}

export async function reorderPublications(
  portfolioId: string,
  publicationIds: string[]
) {
  await prisma.$transaction(
    publicationIds.map(
      (id, index) =>
        prisma.publication.update({
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

export async function toggleFeaturedPublication(
  publicationId: string
) {
  const publication =
    await prisma.publication.findUnique({
      where: {
        id: publicationId,
      },
      select: {
        featured: true,
      },
    });

  if (!publication) {
    throw new Error(
      "Publication not found"
    );
  }

  return prisma.publication.update({
    where: {
      id: publicationId,
    },
    data: {
      featured:
        !publication.featured,
    },
  });
}

export async function getFeaturedPublications(
  portfolioId: string
) {
  return prisma.publication.findMany({
    where: {
      portfolioId,
      featured: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}