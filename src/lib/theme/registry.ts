import DefaultTheme from "@/themes/default";
import ModernTheme from "@/themes/modern";
import MinimalTheme from "@/themes/minimal";
import DarkTheme from "@/themes/dark";
import DeveloperTheme from "@/themes/developer";

export const themeRegistry = {
  default: DefaultTheme,
  modern: ModernTheme,
  minimal: MinimalTheme,
  dark: DarkTheme,
  developer: DeveloperTheme,
} as const;