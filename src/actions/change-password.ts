"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { logPasswordReset } from "@/lib/audit-log";

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

  if (
    !user ||
    !user.password
  ) {
    throw new Error(
      "User not found"
    );
  }

  const valid =
    await bcrypt.compare(
      currentPassword,
      user.password
    );

  if (!valid) {
    throw new Error(
      "Current password is incorrect"
    );
  }

  const samePassword =
    await bcrypt.compare(
      newPassword,
      user.password
    );

  if (samePassword) {
    throw new Error(
      "New password must be different"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      12
    );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password:
        hashedPassword,
    },
  });

  await logPasswordReset(
    userId,
    {
      email:
        user.email,
      source:
        "change_password",
    }
  );

  return {
    success: true,
  };
}