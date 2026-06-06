import { create } from "zustand";

interface ThemeStore {
  theme: string;

  setTheme: (
    theme: string
  ) => void;

  resetTheme: () => void;
}

export const useThemeStore =
  create<ThemeStore>((set) => ({
    theme: "default",

    setTheme: (theme) =>
      set({
        theme,
      }),

    resetTheme: () =>
      set({
        theme: "default",
      }),
  }));