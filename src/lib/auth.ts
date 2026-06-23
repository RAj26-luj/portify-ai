import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { prisma } from "./prisma";
import { UserRole, UserStatus, PortfolioStatus, ApprovalStatus } from "@prisma/client";
import { sendAdminNotification } from "@/services/email/send-admin-notification";

function logAuthSubsystemEvent(level: "error" | "warn" | "debug", message: string, detail?: any) {
  console[`${level}`](`[Auth Subsystem ${level.toUpperCase()}] ${message}`, detail ?? "");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  logger: {
    error(error: Error) {
      logAuthSubsystemEvent("error", error.message, error);
    },

    warn(message: string) {
      logAuthSubsystemEvent("warn", message);
    },

    debug(message: string) {
      logAuthSubsystemEvent("debug", message);
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = String(credentials.email).toLowerCase().trim();

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            return null;
          }

          const validPassword = await bcrypt.compare(String(credentials.password), user.password);

          if (!validPassword) {
            return null;
          }

          if (!user.emailVerified) {
            return null;
          }

          if (user.status === UserStatus.REJECTED || user.isBlocked) {
            return null;
          }

          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLogin: new Date() },
            });
          } catch (updateError) {
            logAuthSubsystemEvent(
              "error",
              "Failed registering last login metrics block.",
              updateError
            );
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            username: user.username,
          } as any;
        } catch (authError) {
          logAuthSubsystemEvent(
            "error",
            "Credentials provider context resolution crashed.",
            authError
          );
          return null;
        }
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.sub = (user as any).id;
        }

        if (!token.sub) {
          return token;
        }

        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          include: { portfolio: true },
        });

        if (!dbUser) {
          return {};
        }

        token.id = dbUser.id;
        token.role = dbUser.role;
        token.status = dbUser.status;
        token.isBlocked = dbUser.isBlocked;
        token.username = dbUser.username;
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.emailVerified = !!dbUser.emailVerified;
        token.isPublic = dbUser.portfolio?.isPublic ?? false;

        const approval = await prisma.approvalRequest.findUnique({
          where: { userId: dbUser.id },
        });

        token.hasApprovalNote = !!approval?.note;

        return token;
      } catch (jwtCallbackError) {
        logAuthSubsystemEvent(
          "error",
          "JWT state serialization pipeline encountered an unhandled execution layer break.",
          jwtCallbackError
        );
        return token;
      }
    },

    async session({ session, token }) {
      try {
        if (token?.isBlocked) {
          return {
            ...session,
            user: null as any,
            expires: new Date(0).toISOString(),
          };
        }

        if (session.user && token) {
          (session.user as any).id = token.id;
          (session.user as any).role = token.role;
          (session.user as any).status = token.status;
          (session.user as any).isBlocked = token.isBlocked;
          (session.user as any).username = token.username;
          (session.user as any).isPublic = token.isPublic;
          (session.user as any).emailVerified = token.emailVerified;
          (session.user as any).hasApprovalNote = token.hasApprovalNote;
        }

        return session;
      } catch (sessionCallbackError) {
        logAuthSubsystemEvent(
          "error",
          "Session construction block encountered an unhandled exception.",
          sessionCallbackError
        );
        return session;
      }
    },

    async signIn({ user, account }) {
      try {
        if (!user?.email) {
          return false;
        }

        if (account?.provider !== "google") {
          return true;
        }

        const email = user.email.toLowerCase().trim();

        let dbUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!dbUser) {
          const usernameBase = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
          const calculatedUsername = `${usernameBase}_${Date.now()}`;

          try {
            dbUser = await prisma.$transaction(async (tx) => {
              const newUser = await tx.user.create({
                data: {
                  email,
                  name: user.name || "",
                  image: user.image,
                  username: calculatedUsername,
                  role: UserRole.USER,
                  status: UserStatus.PENDING,
                  emailVerified: new Date(),
                },
              });

              await tx.approvalRequest.upsert({
                where: { userId: newUser.id },
                update: { status: ApprovalStatus.PENDING },
                create: {
                  userId: newUser.id,
                  status: ApprovalStatus.PENDING,
                  note: null,
                },
              });

              await tx.portfolio.create({
                data: {
                  userId: newUser.id,
                  username: newUser.username,
                  slug: `${newUser.username}-${Date.now()}`,
                  title: newUser.name,
                  status: PortfolioStatus.DRAFT,
                  isPublic: false,
                },
              });

              return newUser;
            });

            sendAdminNotification(
              "New Google User Awaiting Approval",
              `${dbUser.name} (${dbUser.email}) registered using Google and is awaiting approval.`
            ).catch((mailErr) =>
              console.error("Non-blocking background email pipeline dropout:", mailErr)
            );
          } catch (txDbError) {
            logAuthSubsystemEvent(
              "error",
              "Isolated transaction cascade failed mapping new OAuth account configurations rows.",
              txDbError
            );
            return false;
          }
        }

        if (dbUser.isBlocked) {
          return false;
        }

        try {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { lastLogin: new Date() },
          });
        } catch (loginUpdateError) {
          logAuthSubsystemEvent(
            "error",
            "Failed logging entry metrics time stamps.",
            loginUpdateError
          );
        }

        return true;
      } catch (signInCallbackError) {
        logAuthSubsystemEvent(
          "error",
          "Global sign-in verification channel crashed.",
          signInCallbackError
        );
        return false;
      }
    },
  },

  secret: process.env.AUTH_SECRET,
});
