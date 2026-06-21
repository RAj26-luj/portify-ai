import { z } from "zod";

export const customSectionSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(
        1,
        "Title is required"
      )
      .max(
        200,
        "Title is too long"
      ),

    subtitle:
      z.string()
        .max(300)
        .optional(),

    description:
      z.string()
        .max(5000)
        .optional(),

    richTextContent:
      z.string()
        .optional(),

    imageUrl:
      z.string()
        .optional(),

    galleryImages:
      z.array(
        z.string()
      )
      .default([]),

    attachments:
      z.array(
        z.string()
      )
      .default([]),

    buttonText:
      z.string()
        .max(100)
        .optional(),

    buttonUrl:
      z.string()
        .url()
        .optional()
        .or(z.literal("")),

    iconUrl:
      z.string()
        .optional(),

    sectionType:
      z.string()
        .max(100)
        .optional(),

    isVisible:
      z.boolean()
        .optional(),

    displayOrder:
      z.number()
        .int()
        .min(0)
        .optional(),
  });

export type CustomSectionInput =
  z.infer<
    typeof customSectionSchema
  >;