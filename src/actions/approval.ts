"use server";

import { prisma } from "@/lib/prisma";

import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "@/services/email";

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

  return {
    success: true,
  };
}