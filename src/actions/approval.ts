"use server";

import { prisma } from "@/lib/prisma";

import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "@/services/email";

import {
  logUserApproval,
  logUserBlocked,
} from "@/lib/audit-log";

export async function approveUser(
  userId: string
) {
  const user =
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: "APPROVED",
      },
    });

  await sendApprovalEmail(
    user.email
  );

  await logUserApproval(
    user.id,
    {
      email: user.email,
    }
  );

  return {
    success: true,
  };
}

export async function rejectUser(
  userId: string
) {
  const user =
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: "REJECTED",
      },
    });

  await sendRejectionEmail(
    user.email
  );

  await logUserBlocked(
    user.id,
    {
      email: user.email,
      status:
        "REJECTED",
    }
  );

  return {
    success: true,
  };
}