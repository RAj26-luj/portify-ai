"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";

type UserRole = "USER" | "ADMIN";
type UserStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export function useAuth() {
  const {
    data: session,
    status,
    update,
  } = useSession();

  const user = session?.user;

  const derived = useMemo(() => {
    const role =
      (user as {
        role?: UserRole;
      } | null)?.role;

    const userStatus =
      (user as {
        status?: UserStatus;
      } | null)?.status;

    const isBlocked =
      (user as {
        isBlocked?: boolean;
      } | null)?.isBlocked ===
      true;

    const isAdmin =
      role === "ADMIN";

    const isApproved =
      userStatus ===
      "APPROVED";

    const isPending =
      userStatus ===
      "PENDING";

    const isRejected =
      userStatus ===
      "REJECTED";

    const canAccessDashboard =
      !isBlocked &&
      (isAdmin || isApproved);

    return {
      role,
      userStatus,
      isBlocked,
      isAdmin,
      isApproved,
      isPending,
      isRejected,
      canAccessDashboard,
    };
  }, [user]);

  return {
    user,
    session,
    update,

    loading:
      status === "loading",

    authenticated:
      status ===
      "authenticated",

    unauthenticated:
      status ===
      "unauthenticated",

    ...derived,
  };
}