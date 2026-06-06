import { themes } from "@/constants/themes";

export async function getThemes() {
  return themes;
}

export async function getThemeById(
  id: string
) {
  return themes.find(
    (theme) =>
      theme.id === id
  );
}