import { z } from "zod";
import { ThemeType } from "@prisma/client";

export const themeSchema =
  z.object({
    activeTheme:
      z.nativeEnum(
        ThemeType
      ),

    config:
      z.record(
        z.string(),
        z.any()
      )
      .optional(),
  });

export type ThemeInput =
  z.infer<
    typeof themeSchema
  >;