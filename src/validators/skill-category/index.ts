import { z } from "zod";

export const skillCategorySchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        "Category name is required"
      )
      .max(
        100,
        "Category name is too long"
      ),

    displayOrder: z
      .number()
      .int()
      .min(0)
      .optional(),
  });

export type SkillCategoryInput =
  z.infer<
    typeof skillCategorySchema
  >;