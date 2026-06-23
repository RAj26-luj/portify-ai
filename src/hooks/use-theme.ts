"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type ThemeType = "DEFAULT" | "MODERN" | "MINIMAL" | "DARK" | "DEVELOPER";

export function useTheme() {
  const { data: session } = useSession();

  const [theme, setThemeState] = useState<ThemeType>("DEFAULT");

  useEffect(() => {
    const dbTheme = (session?.user as any)?.theme as ThemeType | undefined;

    if (dbTheme) {
      setThemeState(dbTheme);
      return;
    }

    const localTheme = localStorage.getItem("theme") as ThemeType | null;

    if (localTheme) {
      setThemeState(localTheme);
    }
  }, [session]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return {
    theme,
    setTheme,
  };
}
