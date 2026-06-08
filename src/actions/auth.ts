"use server";

import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";

import { registerSchema } from "@/validators/auth/register";
import { loginSchema } from "@/validators/auth/login";
import { forgotPasswordSchema } from "@/validators/auth/forgot-password";
import { resetPasswordSchema } from "@/validators/auth/reset-password";
import { sendAdminNotification } from "@/services/email/send-admin-notification";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "@/services/email";
import {
  logRegistration,
  logPasswordReset,
} from "@/lib/audit-log";

export async function registerUser(
  data: unknown
) {
  const parsed =
    registerSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid data",
    };
  }

  const {
    name,
    email,
    password,
  } = parsed.data;

  const existing =
    await prisma.user.findUnique({
      where: { email },
    });

  if (existing) {
    return {
      success: false,
      error: "Email already exists",
    };
  }

  const hashedPassword =
    await bcrypt.hash(password, 12);

  const user =
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    await logRegistration(
  user.id,
  {
    email:
      user.email,
  }
);
    const baseUsername =
  email
    .split("@")[0]
    .toLowerCase()
    .replace(/\s+/g, "");

const existingPortfolio =
  await prisma.portfolio.findUnique({
    where: {
      username:
        baseUsername,
    },
  });

const username =
  existingPortfolio
    ? `${baseUsername}-${Date.now()}`
    : baseUsername;

await prisma.portfolio.create({
  data: {
    userId: user.id,

    username,

    title: `${name}'s Portfolio`,

    bio: "",

    status: "DRAFT",
  },
});

  const token = randomUUID();

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(
        Date.now() +
          1000 * 60 * 60 * 24
      ),
    },
  });

  await sendVerificationEmail(
    email,
    token
  );
  await sendAdminNotification(
  "New User Registration",
  `${name} (${email}) has registered and is awaiting approval.`
);

  return {
    success: true,
    userId: user.id,
  };
}

export async function loginUser(
  data: unknown
) {
  const parsed =
    loginSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid credentials",
    };
  }

  return {
    success: true,
  };
}

export async function forgotPassword(
  data: unknown
) {
  const parsed =
    forgotPasswordSchema.safeParse(
      data
    );

  if (!parsed.success) {
    return {
      success: false,
    };
  }

  const user =
    await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
    });

  if (!user) {
    return {
      success: true,
    };
  }

  const token = randomUUID();

  await prisma.verificationToken.create({
    data: {
      identifier: user.email,
      token,
      expires: new Date(
        Date.now() +
          1000 * 60 * 60
      ),
    },
  });

  await sendResetPasswordEmail(
    user.email,
    token
  );

  return {
    success: true,
  };
}

export async function resetPassword(
  data: unknown
) {
  const parsed =
    resetPasswordSchema.safeParse(
      data
    );

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid data",
    };
  }

  const verification =
    await prisma.verificationToken.findFirst(
      {
        where: {
          token:
            parsed.data.token,
        },
      }
    );

  if (!verification) {
    return {
      success: false,
      error: "Invalid token",
    };
  }

  const hashedPassword =
    await bcrypt.hash(
      parsed.data.password,
      12
    );

  const user =
    await prisma.user.update({
      where: {
        email:
          verification.identifier,
      },
      data: {
        password:
          hashedPassword,
      },
    });

  await logPasswordReset(
    user.id,
    {
      email:
        user.email,
    }
  );

  await prisma.verificationToken.delete(
    {
      where: {
        id:
          verification.id,
      },
    }
  );

  return {
    success: true,
  };
}