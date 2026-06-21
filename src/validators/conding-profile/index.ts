import { z } from "zod";

export const codingProfileSchema =
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

    username: z
      .string()
      .trim()
      .min(
        1,
        "Username is required"
      )
      .max(
        100,
        "Username is too long"
      ),

    profileUrl: z
      .string()
      .url(
        "Valid profile URL is required"
      ),

    iconName:
      z.string().optional(),

    iconUrl:
      z.string().optional(),

    currentRating:
      z.number()
        .int()
        .min(0)
        .optional(),

    maxRating:
      z.number()
        .int()
        .min(0)
        .optional(),

    rank:
      z.string()
        .max(100)
        .optional(),

    globalRank:
      z.string()
        .max(100)
        .optional(),

    problemsSolved:
      z.number()
        .int()
        .min(0)
        .optional(),

    contestsAttended:
      z.number()
        .int()
        .min(0)
        .optional(),

    activeSince:
      z.string()
        .max(100)
        .optional(),

    displayOrder:
      z.number()
        .int()
        .min(0)
        .optional(),
  });

export type CodingProfileInput =
  z.infer<
    typeof codingProfileSchema
  >;