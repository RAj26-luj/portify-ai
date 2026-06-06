import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
      status: "PENDING" | "APPROVED" | "REJECTED";
      isBlocked: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: "USER" | "ADMIN";
    status: "PENDING" | "APPROVED" | "REJECTED";
    isBlocked: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "USER" | "ADMIN";
    status: "PENDING" | "APPROVED" | "REJECTED";
    isBlocked: boolean;
  }
}