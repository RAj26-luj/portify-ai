"use server";

import { prisma } from "@/lib/prisma";
import {
  logUserBlocked,
} from "@/lib/audit-log";
import {
  createAuditLog,
} from "@/lib/audit-log";
export async function getUserById(
  id: string
) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function blockUser(
  id: string
) {
  const user =
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        isBlocked: true,
      },
    });

  await logUserBlocked(
    user.id,
    {
      email:
        user.email,
      blocked: true,
    }
  );

  return user;
}

export async function unblockUser(
  id: string
) {
  const user =
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        isBlocked: false,
      },
    });

  await logUserBlocked(
    user.id,
    {
      email:
        user.email,
      blocked: false,
    }
  );

  return user;
}

export async function deleteUser(
  id: string
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id,
      },
    });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  await createAuditLog(
    "USER_DELETED",
    user.id,
    {
      email:
        user.email,
    }
  );

  return prisma.user.delete({
    where: {
      id,
    },
  });
}