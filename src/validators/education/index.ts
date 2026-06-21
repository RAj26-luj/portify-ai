import { z } from "zod";

export const educationSchema =
  z.object({
    institution: z
      .string()
      .trim()
      .min(
        2,
        "Institution name is required"
      )
      .max(
        200,
        "Institution name is too long"
      ),

    degree: z
      .string()
      .trim()
      .min(
        2,
        "Degree is required"
      )
      .max(
        200,
        "Degree is too long"
      ),

    fieldOfStudy:
      z.string()
        .max(200)
        .optional(),

    grade:
      z.string()
        .max(50)
        .optional(),

    cgpa:
      z.string()
        .max(50)
        .optional(),

    location:
      z.string()
        .max(200)
        .optional(),

    institutionImage:
      z.string()
        .optional(),

    logoUrl:
      z.string()
        .optional(),

    description:
      z.string()
        .max(3000)
        .optional(),

    startDate:
      z.string()
        .optional(),

    endDate:
      z.string()
        .optional(),

    currentlyStudying:
      z.boolean()
        .optional(),

    displayOrder:
      z.number()
        .int()
        .min(0)
        .optional(),
  });

export type EducationInput =
  z.infer<
    typeof educationSchema
  >;