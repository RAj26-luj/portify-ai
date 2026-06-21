import { prisma } from "@/lib/prisma";

export async function getTestimonials(
  portfolioId: string
) {
  return prisma.testimonial.findMany({
    where: {
      portfolioId,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export async function getTestimonial(
  testimonialId: string
) {
  return prisma.testimonial.findUnique({
    where: {
      id: testimonialId,
    },
  });
}

export async function createTestimonial(
  portfolioId: string,
  data: {
    authorName: string;
    authorRole?: string;
    company?: string;
    testimonial: string;
    profileImage?: string;
    linkedinUrl?: string;
    companyLogo?: string;
    featured?: boolean;
  }
) {
  const count =
    await prisma.testimonial.count({
      where: {
        portfolioId,
      },
    });

  return prisma.testimonial.create({
    data: {
      portfolioId,
      authorName:
        data.authorName,
      authorRole:
        data.authorRole,
      company:
        data.company,
      testimonial:
        data.testimonial,
      profileImage:
        data.profileImage,
      linkedinUrl:
        data.linkedinUrl,
      companyLogo:
        data.companyLogo,
      featured:
        data.featured ??
        false,
      displayOrder:
        count,
    },
  });
}

export async function updateTestimonial(
  testimonialId: string,
  data: Record<
    string,
    unknown
  >
) {
  return prisma.testimonial.update({
    where: {
      id: testimonialId,
    },
    data,
  });
}

export async function deleteTestimonial(
  testimonialId: string
) {
  return prisma.testimonial.delete({
    where: {
      id: testimonialId,
    },
  });
}

export async function reorderTestimonials(
  portfolioId: string,
  testimonialIds: string[]
) {
  await prisma.$transaction(
    testimonialIds.map(
      (
        id,
        index
      ) =>
        prisma.testimonial.update({
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

export async function toggleFeaturedTestimonial(
  testimonialId: string
) {
  const testimonial =
    await prisma.testimonial.findUnique({
      where: {
        id: testimonialId,
      },
      select: {
        featured: true,
      },
    });

  if (!testimonial) {
    throw new Error(
      "Testimonial not found"
    );
  }

  return prisma.testimonial.update({
    where: {
      id: testimonialId,
    },
    data: {
      featured:
        !testimonial.featured,
    },
  });
}

export async function getFeaturedTestimonials(
  portfolioId: string
) {
  return prisma.testimonial.findMany({
    where: {
      portfolioId,
      featured: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}