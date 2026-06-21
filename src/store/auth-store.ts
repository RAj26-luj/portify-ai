import { create } from "zustand";
import type { UserStatus } from "@prisma/client";

interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: "USER" | "ADMIN";
  status?: UserStatus;
  isBlocked?: boolean;
  image?: string | null;
  username?: string | null;
}

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;

  setUser: (
    user: AuthUser | null
  ) => void;

  setLoading: (
    loading: boolean
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthStore>((set) => ({
    user: null,
    loading: false,

    setUser: (user) =>
      set({
        user,
      }),

    setLoading: (loading) =>
      set({
        loading,
      }),

    logout: () =>
      set({
        user: null,
        loading: false,
      }),
  }));