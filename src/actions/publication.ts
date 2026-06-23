"use server";

import { prisma } from "@/lib/prisma";
import { getPortfolioId } from "@/lib/get-portfolio-id";

// Error
function handlePublicationServerError(error: any, fallbackMessage: string) {
  console.error("Publication Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("portfolioId required") ||
    errorMessage.includes("portfolioId not found")
  ) {
    return {
      success: false,
      error:
        "Authentication reference token is missing. Could not link academic research to a portfolio profile.",
    };
  }
  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return {
      success: false,
      error:
        "Research publication datastore is carrying out system maintenance. Please re-submit changes.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function createPublication(data: {
  portfolioId: string;
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
}) {
  try {
    const resolvedPortfolioId = data.portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Portfolio specification profile identification target not found.",
      };
    }

    if (!data.title) {
      return {
        success: false,
        error: "Research publication paper title field parameter is required.",
      };
    }

    const count = await prisma.publication.count({
      where: {
        portfolioId: resolvedPortfolioId,
      },
    });

    const result = await prisma.publication.create({
      data: {
        portfolioId: resolvedPortfolioId,
        title: data.title,
        journal: data.journal,
        featured: data.featured ?? false,
        publisher: data.publisher,
        publicationDate: data.publicationDate,
        doi: data.doi,
        citations: data.citations,
        abstract: data.abstract,
        publicationUrl: data.publicationUrl,
        pdfUrl: data.pdfUrl,
        conference: data.conference,
        publicationCover: data.publicationCover,
        authors: data.authors ?? [],
        displayOrder: data.displayOrder ?? count,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return handlePublicationServerError(
      error,
      "Failed to instantiate new research publication record item details."
    );
  }
}

export async function updatePublication(
  id: string,
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
  try {
    if (!id) {
      return {
        success: false,
        error: "Missing unique structural identification mapping reference string key.",
      };
    }

    const result = await prisma.publication.update({
      where: { id },
      data,
    });

    return { success: true, data: result };
  } catch (error) {
    return handlePublicationServerError(
      error,
      "Failed to apply scientific entry modifications back into database store."
    );
  }
}

export async function getPublications(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Unable to sync research logs. Target portfolio tracking context was not verified.",
        data: [],
      };
    }

    const data = await prisma.publication.findMany({
      where: {
        portfolioId: resolvedPortfolioId,
      },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to query scholarly papers bibliography database logs feed:", error);
    return {
      success: false,
      error: "Failed to compile research history catalog grid lists view feeds dashboard.",
      data: [],
    };
  }
}

export async function getPublicationById(id: string) {
  try {
    if (!id) return { success: true, data: null };

    const data = await prisma.publication.findUnique({
      where: { id },
    });

    return { success: true, data };
  } catch (error) {
    return handlePublicationServerError(
      error,
      "Failed to cross-reference system parameter tracking records lines for this paper."
    );
  }
}

export async function deletePublication(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error:
          "Missing literature index reference trace tracking key pointer. Removal sequence aborted.",
      };
    }

    const result = await prisma.publication.delete({
      where: { id },
    });

    return { success: true, data: result };
  } catch (error) {
    return handlePublicationServerError(
      error,
      "The specified scientific index publication row could not be successfully cleared."
    );
  }
}
