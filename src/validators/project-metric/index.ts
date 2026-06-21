import { z } from "zod";

export const projectMetricSchema =
  z.object({
    label: z
      .string()
      .trim()
      .min(
        1,
        "Label is required"
      )
      .max(
        200,
        "Label is too long"
      ),

    value: z
      .string()
      .trim()
      .min(
        1,
        "Value is required"
      )
      .max(
        500,
        "Value is too long"
      ),

    description:
      z.string()
        .max(5000)
        .optional(),

    displayOrder:
      z.number()
        .int()
        .min(0)
        .optional(),
  });

export type ProjectMetricInput =
  z.infer<
    typeof projectMetricSchema
  >;