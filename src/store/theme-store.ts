import { create } from "zustand";
import type { ThemeType } from "@prisma/client";

interface ThemeStore {
  theme: ThemeType;

  setTheme: (theme: ThemeType) => void;
  resetTheme: () => void;

  isDark: boolean;
  isLight: boolean;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: "DEFAULT",

  setTheme: (theme) => set({ theme }),

  resetTheme: () => set({ theme: "DEFAULT" }),

  get isDark() {
    return get().theme === "DARK";
  },

  get isLight() {
    return get().theme !== "DARK";
  },
}));