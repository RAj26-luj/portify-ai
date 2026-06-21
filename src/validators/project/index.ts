import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Project title is required")
    .max(200, "Project title is too long"),

  shortDescription: z
    .string()
    .max(300)
    .optional()
    .nullable(),

  description: z
    .string()
    .max(5000)
    .optional()
    .nullable(),

  problemStatement: z
    .string()
    .max(5000)
    .optional()
    .nullable(),

  solution: z
    .string()
    .max(5000)
    .optional()
    .nullable(),

  category: z
    .string()
    .max(100)
    .optional()
    .nullable(),

  role: z
    .string()
    .max(150)
    .optional()
    .nullable(),

  teamSize: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .nullable(),

  projectBanner: z
    .string()
    .optional()
    .nullable(),

  coverImage: z
    .string()
    .optional()
    .nullable(),

  thumbnail: z
    .string()
    .optional()
    .nullable(),

  githubUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal("")),

  liveUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal("")),

  demoUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal("")),

  videoUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal("")),

  techStack: z
    .array(z.string())
    .default([]),

  images: z
    .array(z.string())
    .default([]),

  featured: z
    .boolean()
    .default(false),

  displayOrder: z
    .number()
    .int()
    .default(0),

  type: z
    .enum([
      "PERSONAL",
      "ACADEMIC",
      "PROFESSIONAL",
      "RESEARCH",
      "OPEN_SOURCE",
    ])
    .optional()
    .nullable(),

  status: z
    .enum([
      "PLANNING",
      "IN_PROGRESS",
      "COMPLETED",
      "MAINTAINED",
    ])
    .optional()
    .nullable(),

  startDate: z
    .string()
    .optional()
    .nullable(),

  endDate: z
    .string()
    .optional()
    .nullable(),
});

export const projectMetricSchema = z.object({
  projectId: z
    .string()
    .min(1, "Project is required"),

  label: z
    .string()
    .trim()
    .min(1)
    .max(100),

  value: z
    .string()
    .trim()
    .min(1)
    .max(200),

  description: z
    .string()
    .max(500)
    .optional()
    .nullable(),

  displayOrder: z
    .number()
    .int()
    .default(0),
});

export type ProjectInput = z.infer<
  typeof projectSchema
>;

export type ProjectMetricInput = z.infer<
  typeof projectMetricSchema
>;