import { prisma } from "@/lib/prisma";

interface CreateChangeLogInput {
  resumeVersionId: string;
  section: string;
  fieldName: string;
  oldValue?: string | null;
  newValue?: string | null;
}

export async function createChangeLog({
  resumeVersionId,
  section,
  fieldName,
  oldValue,
  newValue,
}: CreateChangeLogInput) {
  return prisma.resumeChangeLog.create({
    data: {
      resumeVersionId,
      section,
      fieldName,
      oldValue,
      newValue,
    },
  });
}

export async function createChangeLogs(
  logs: CreateChangeLogInput[]
) {
  if (!logs.length) {
    return;
  }

  return prisma.resumeChangeLog.createMany({
    data: logs.map((log) => ({
      resumeVersionId: log.resumeVersionId,
      section: log.section,
      fieldName: log.fieldName,
      oldValue: log.oldValue ?? null,
      newValue: log.newValue ?? null,
    })),
  });
}