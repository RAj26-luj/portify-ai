import { create } from "zustand";

interface ThemeStore {
  theme: string;

  setTheme: (
    theme: string
  ) => void;
}

export const useThemeStore =
  create<ThemeStore>((set) => ({
    theme: "default",

    setTheme: (theme) =>
      set({ theme }),
  }));