import { z } from "zod";

export const socialLinkSchema =
  z.object({
    platform: z
      .string()
      .trim()
      .min(
        2,
        "Platform is required"
      )
      .max(
        100,
        "Platform is too long"
      ),

    username:
      z.string()
        .max(150)
        .optional(),

    url: z
      .string()
      .url(
        "Valid URL is required"
      ),

    iconName:
      z.string()
        .max(100)
        .optional(),

    iconUrl:
      z.string()
        .optional(),

    iconSource:
      z.enum([
        "LIBRARY",
        "USER_UPLOAD",
        "DEFAULT_ICON",
      ])
        .optional(),

    displayOrder:
      z.number()
        .int()
        .min(0)
        .optional(),
  });

export type SocialLinkInput =
  z.infer<
    typeof socialLinkSchema
  >;