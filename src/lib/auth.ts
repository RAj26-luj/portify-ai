import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

import { prisma } from "./prisma";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret:
        process.env.AUTH_GOOGLE_SECRET!,
    }),

    Credentials({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        const user =
          await prisma.user.findUnique({
            where: {
              email: String(
                credentials.email
              ).toLowerCase(),
            },
          });

        if (
          !user ||
          !user.password
        ) {
          return null;
        }

        const valid =
          await bcrypt.compare(
            String(
              credentials.password
            ),
            user.password
          );

        if (!valid) {
          return null;
        }

if (!user.emailVerified) {
  throw new Error(
    "EMAIL_NOT_VERIFIED"
  );
}

if (
  user.status ===
  "REJECTED"
) {
  throw new Error(
    "ACCOUNT_REJECTED"
  );
}

if (
  user.status !==
  "APPROVED"
) {
  throw new Error(
    "ACCOUNT_PENDING"
  );
}

if (user.isBlocked) {
  throw new Error(
    "ACCOUNT_BLOCKED"
  );
}
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          status: user.status,
          isBlocked:
            user.isBlocked,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({
      user,
      account,
    }) {
      if (
        account?.provider ===
        "google"
      ) {
        await prisma.user.update({
          where: {
            email:
              user.email!,
          },
          data: {
            emailVerified:
              new Date(),
          },
        });
      }

 const dbUser =
  await prisma.user.findUnique({
    where: {
      email: user.email!,
    },
  });

if (!dbUser) {
  return false;
}

if (dbUser.isBlocked) {
  return false;
}

if (
  dbUser.status ===
  "REJECTED"
) {
  return false;
}

if (
  dbUser.status !==
  "APPROVED"
) {
  return false;
}

return true;
    },

    async jwt({
      token,
      user,
    }) {
      if (user) {
        token.id = user.id;
        token.role =
          user.role;
        token.status =
          user.status;
        token.isBlocked =
          user.isBlocked;
      }

      if (token.email) {
        const dbUser =
          await prisma.user.findUnique(
            {
              where: {
                email:
                  token.email,
              },
            }
          );

        if (dbUser) {
          token.id =
            dbUser.id;
          token.role =
            dbUser.role;
          token.status =
            dbUser.status;
          token.isBlocked =
            dbUser.isBlocked;
        }
      }

      return token;
    },

    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id =
          token.id as string;

        session.user.role =
          token.role as
            | "USER"
            | "ADMIN";

        session.user.status =
          token.status as
            | "PENDING"
            | "APPROVED"
            | "REJECTED";

        session.user.isBlocked =
          token.isBlocked as boolean;
      }

      return session;
    },
  },

  secret:
    process.env.AUTH_SECRET,
};