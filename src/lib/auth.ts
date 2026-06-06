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
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    Credentials({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: String(credentials.email).toLowerCase(),
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const valid = await bcrypt.compare(
          String(credentials.password),
          user.password
        );

        if (!valid) {
          return null;
        }

        if (user.isBlocked) {
          throw new Error("ACCOUNT_BLOCKED");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          status: user.status,
          isBlocked: user.isBlocked,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (user.isBlocked) {
        return false;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.isBlocked = user.isBlocked;
      }

      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: token.email,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.status = dbUser.status;
          token.isBlocked = dbUser.isBlocked;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "ADMIN";
        session.user.status = token.status as
          | "PENDING"
          | "APPROVED"
          | "REJECTED";

        session.user.isBlocked = token.isBlocked as boolean;
      }

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
};