import { THEME_PRESETS } from "@/lib/theme-presets";

export const themes = THEME_PRESETS;

export type ThemeId = (typeof themes)[number]["id"];

export const themeIds = themes.map((theme) => theme.id) as ThemeId[];
