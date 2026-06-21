import { z } from "zod";

export const skillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Skill name is required")
    .max(100, "Skill name is too long"),

  categoryId: z.string().optional(),

  proficiency: z
    .enum([
      "BEGINNER",
      "INTERMEDIATE",
      "ADVANCED",
      "EXPERT",
    ])
    .optional(),

  yearsOfExperience: z
    .number()
    .int()
    .min(0)
    .max(50)
    .optional(),

  iconName: z
    .string()
    .max(100)
    .optional(),

  iconUrl: z
    .string()
    .optional(),

  iconSource: z
    .enum([
      "LIBRARY",
      "USER_UPLOAD",
      "DEFAULT_ICON",
    ])
    .optional(),

  description: z
    .string()
    .max(1000)
    .optional(),

  tag: z
    .string()
    .max(100)
    .optional(),

  displayOrder: z
    .number()
    .int()
    .min(0)
    .optional(),
});

export const skillCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name is too long"),

  displayOrder: z
    .number()
    .int()
    .min(0)
    .optional(),
});

export type SkillInput =
  z.infer<typeof skillSchema>;

export type SkillCategoryInput =
  z.infer<typeof skillCategorySchema>;