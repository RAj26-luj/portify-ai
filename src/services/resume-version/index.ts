import { prisma } from "@/lib/prisma";

export async function getResumeVersions(
  portfolioId: string
) {
  return prisma.resumeVersion.findMany({
    where: {
      portfolioId,
    },
    include: {
      changeLogs: true,
    },
    orderBy: {
      uploadedAt:
        "desc",
    },
  });
}

export async function getResumeVersion(
  versionId: string
) {
  return prisma.resumeVersion.findUnique({
    where: {
      id: versionId,
    },
    include: {
      changeLogs: {
        orderBy: {
          createdAt:
            "desc",
        },
      },
    },
  });
}

export async function createResumeVersion(
  portfolioId: string,
  fileName: string,
  fileUrl: string
) {
  return prisma.resumeVersion.create({
    data: {
      portfolioId,
      fileName,
      fileUrl,
    },
  });
}

export async function deleteResumeVersion(
  versionId: string
) {
  return prisma.resumeVersion.delete({
    where: {
      id: versionId,
    },
  });
}

export async function addResumeChangeLog(
  resumeVersionId: string,
  data: {
    section: string;
    fieldName: string;
    oldValue?: string;
    newValue?: string;
  }
) {
  return prisma.resumeChangeLog.create({
    data: {
      resumeVersionId,
      section:
        data.section,
      fieldName:
        data.fieldName,
      oldValue:
        data.oldValue,
      newValue:
        data.newValue,
    },
  });
}

export async function getResumeChangeLogs(
  resumeVersionId: string
) {
  return prisma.resumeChangeLog.findMany({
    where: {
      resumeVersionId,
    },
    orderBy: {
      createdAt:
        "desc",
    },
  });
}

export async function deleteResumeChangeLog(
  changeLogId: string
) {
  return prisma.resumeChangeLog.delete({
    where: {
      id: changeLogId,
    },
  });
}