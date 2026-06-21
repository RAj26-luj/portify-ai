import { z } from "zod";

export const publicationSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(
        2,
        "Publication title is required"
      )
      .max(
        300,
        "Publication title is too long"
      ),

    journal:
      z.string()
        .max(200)
        .optional(),

    featured:
      z.boolean()
        .optional(),

    publisher:
      z.string()
        .max(200)
        .optional(),

    publicationDate:
      z.string()
        .optional(),

    doi:
      z.string()
        .max(200)
        .optional(),

    citations:
      z.number()
        .int()
        .min(0)
        .optional(),

    abstract:
      z.string()
        .max(10000)
        .optional(),

    publicationUrl:
      z.string()
        .url()
        .optional()
        .or(z.literal("")),

    pdfUrl:
      z.string()
        .url()
        .optional()
        .or(z.literal("")),

    conference:
      z.string()
        .max(200)
        .optional(),

    publicationCover:
      z.string()
        .optional(),

    authors:
      z.array(
        z.string()
      )
      .default([]),

    displayOrder:
      z.number()
        .int()
        .min(0)
        .optional(),
  });

export type PublicationInput =
  z.infer<
    typeof publicationSchema
  >;