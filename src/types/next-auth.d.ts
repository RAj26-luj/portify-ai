import { DefaultSession } from "next-auth";
import { UserRole, UserStatus } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      status: UserStatus;
      isBlocked: boolean;
      emailVerified: boolean;
      hasApprovalNote?: boolean;

      username?: string | null;
      phone?: string | null;
      website?: string | null;
      country?: string | null;
      state?: string | null;
      city?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    status: UserStatus;
    isBlocked: boolean;
    emailVerified: boolean;
    hasApprovalNote?: boolean;

    username?: string | null;
    phone?: string | null;
    website?: string | null;
    country?: string | null;
    state?: string | null;
    city?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    status: UserStatus;
    isBlocked: boolean;
    emailVerified: boolean;
    hasApprovalNote?: boolean;

    username?: string | null;
    phone?: string | null;
    website?: string | null;
    country?: string | null;
    state?: string | null;
    city?: string | null;
  }
}