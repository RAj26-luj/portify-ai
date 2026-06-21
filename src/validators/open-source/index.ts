import { z } from "zod";

export const openSourceProjectSchema =
  z.object({
    repositoryName: z
      .string()
      .trim()
      .min(
        2,
        "Repository name is required"
      )
      .max(
        200,
        "Repository name is too long"
      ),

    repositoryUrl:
      z.string()
        .url()
        .optional()
        .or(z.literal("")),

    pullRequestUrl:
      z.string()
        .url()
        .optional()
        .or(z.literal("")),

    pullRequestTitle:
      z.string()
        .max(300)
        .optional(),

    issueTitle:
      z.string()
        .max(300)
        .optional(),

    contributionTitle:
      z.string()
        .max(300)
        .optional(),

    contributionType:
      z.string()
        .max(100)
        .optional(),

    description:
      z.string()
        .max(5000)
        .optional(),

    linesChanged:
      z.string()
        .max(100)
        .optional(),

    impactMetrics:
      z.array(
        z.string()
      )
      .default([]),

    architectureDiagrams:
      z.array(
        z.string()
      )
      .default([]),

    contributionScreenshots:
      z.array(
        z.string()
      )
      .default([]),

    coverImage:
      z.string()
        .optional(),

    status: z
      .enum([
        "PLANNING",
        "IN_PROGRESS",
        "COMPLETED",
        "MAINTAINED",
      ])
      .optional(),

    displayOrder: z
      .number()
      .int()
      .min(0)
      .default(0),
  });

export const openSourceTimelineSchema =
  z.object({
    milestone: z
      .string()
      .trim()
      .min(1)
      .max(200),

    progress: z
      .number()
      .int()
      .min(0)
      .max(100),

    description:
      z.string()
        .max(1000)
        .optional(),

    displayOrder: z
      .number()
      .int()
      .min(0)
      .default(0),
  });

export type OpenSourceProjectInput =
  z.infer<
    typeof openSourceProjectSchema
  >;

export type OpenSourceTimelineInput =
  z.infer<
    typeof openSourceTimelineSchema
  >;