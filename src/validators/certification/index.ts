import { z } from "zod";

export const certificationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "Certification name is required"
    )
    .max(
      200,
      "Certification name is too long"
    ),

  issuer: z
    .string()
    .max(200)
    .optional(),

  featured: z
    .boolean()
    .optional(),

  credentialId: z
    .string()
    .max(200)
    .optional(),

  issueDate: z
    .string()
    .optional(),

  expiryDate: z
    .string()
    .optional(),

  credentialUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal("")),

  certificateImage: z
    .string()
    .optional(),

  certificatePdf: z
    .string()
    .optional(),

  skillsCovered: z
    .array(
      z.string()
    )
    .default([]),

  displayOrder: z
    .number()
    .int()
    .optional(),
});

export type CertificationInput =
  z.infer<
    typeof certificationSchema
  >;