import { ThemeType } from "@prisma/client";

export const THEME_PRESETS = [
  {
    id: ThemeType.DEFAULT,
    name: "Default",
    description:
      "Balanced portfolio layout",
    layout: "default",
  },

  {
    id: ThemeType.MODERN,
    name: "Modern",
    description:
      "Clean modern design",
    layout: "modern",
  },

  {
    id: ThemeType.MINIMAL,
    name: "Minimal",
    description:
      "Simple distraction free layout",
    layout: "minimal",
  },

  {
    id: ThemeType.DEVELOPER,
    name: "Developer",
    description:
      "Cyber luxury portfolio theme",
    layout: "developer",
  },

  {
    id: ThemeType.DARK,
    name: "Dark",
    description:
      "Dark theme experience",
    layout: "dark",
  },
] as const;

export const themes =
  THEME_PRESETS;