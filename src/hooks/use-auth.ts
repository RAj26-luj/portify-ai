"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data, status } =
    useSession();

  return {
    user: data?.user,
    session: data,
    loading:
      status === "loading",
    authenticated:
      status ===
      "authenticated",
  };
}