import { z } from "zod";

export const testimonialSchema = z.object({
  authorName: z
    .string()
    .trim()
    .min(2, "Author name is required")
    .max(100, "Author name is too long"),

  authorRole: z
    .string()
    .max(150)
    .optional(),

  company: z
    .string()
    .max(150)
    .optional(),

  testimonial: z
    .string()
    .trim()
    .min(10, "Testimonial is required")
    .max(3000, "Testimonial is too long"),

  profileImage: z
    .string()
    .optional(),

  linkedinUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal("")),

  companyLogo: z
    .string()
    .optional(),

  featured: z
    .boolean()
    .optional(),

  displayOrder: z
    .number()
    .int()
    .min(0)
    .optional()
    .default(0),
});

export type TestimonialInput =
  z.infer<typeof testimonialSchema>;