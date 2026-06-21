import { prisma } from "@/lib/prisma";

export async function getCertifications(
  portfolioId: string
) {
  return prisma.certification.findMany({
    where: {
      portfolioId,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export async function getCertification(
  certificationId: string
) {
  return prisma.certification.findUnique({
    where: {
      id: certificationId,
    },
  });
}

export async function createCertification(
  portfolioId: string,
  data: {
    name: string;
    issuer?: string;
    credentialId?: string;
    issueDate?: Date;
    expiryDate?: Date;
    credentialUrl?: string;
    certificateImage?: string;
    certificatePdf?: string;
    skillsCovered?: string[];
    featured?: boolean;
    displayOrder?: number;
  }
) {
  const count =
    await prisma.certification.count({
      where: {
        portfolioId,
      },
    });

  return prisma.certification.create({
    data: {
      portfolioId,
      name: data.name,
      issuer: data.issuer,
      credentialId:
        data.credentialId,
      issueDate:
        data.issueDate,
      expiryDate:
        data.expiryDate,
      credentialUrl:
        data.credentialUrl,
      certificateImage:
        data.certificateImage,
      certificatePdf:
        data.certificatePdf,
      skillsCovered:
        data.skillsCovered ??
        [],
      featured:
        data.featured ??
        false,
      displayOrder:
        data.displayOrder ??
        count,
    },
  });
}

export async function updateCertification(
  certificationId: string,
  data: {
    name?: string;
    issuer?: string;
    credentialId?: string;
    issueDate?: Date;
    expiryDate?: Date;
    credentialUrl?: string;
    certificateImage?: string;
    certificatePdf?: string;
    skillsCovered?: string[];
    featured?: boolean;
    displayOrder?: number;
  }
) {
  return prisma.certification.update({
    where: {
      id: certificationId,
    },
    data,
  });
}

export async function deleteCertification(
  certificationId: string
) {
  return prisma.certification.delete({
    where: {
      id: certificationId,
    },
  });
}

export async function reorderCertifications(
  portfolioId: string,
  certificationIds: string[]
) {
  await prisma.$transaction(
    certificationIds.map(
      (id, index) =>
        prisma.certification.update({
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

export async function toggleFeaturedCertification(
  certificationId: string
) {
  const certification =
    await prisma.certification.findUnique({
      where: {
        id: certificationId,
      },
      select: {
        featured: true,
      },
    });

  if (!certification) {
    throw new Error(
      "Certification not found"
    );
  }

  return prisma.certification.update({
    where: {
      id: certificationId,
    },
    data: {
      featured:
        !certification.featured,
    },
  });
}

export async function getFeaturedCertifications(
  portfolioId: string
) {
  return prisma.certification.findMany({
    where: {
      portfolioId,
      featured: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}