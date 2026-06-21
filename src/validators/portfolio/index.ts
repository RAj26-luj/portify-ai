import { z } from "zod";

export const portfolioSchema =
  z.object({
    username: z
      .string()
      .trim()
      .min(
        3,
        "Username must be at least 3 characters"
      )
      .max(
        30,
        "Username is too long"
      ),

    title: z
      .string()
      .trim()
      .max(150)
      .optional(),

    tagline: z
      .string()
      .trim()
      .max(300)
      .optional(),

    bio: z
      .string()
      .trim()
      .max(5000)
      .optional(),

    category: z
      .enum([
        "STUDENT",
        "WORKING_PROFESSIONAL",
        "FREELANCER",
        "RESEARCHER",
        "STARTUP_FOUNDER",
      ])
      .optional(),

    email: z
      .string()
      .email()
      .optional()
      .or(z.literal("")),

    phone: z
      .string()
      .optional(),

    website: z
      .string()
      .url()
      .optional()
      .or(z.literal("")),

    country: z
      .string()
      .max(100)
      .optional(),

    state: z
      .string()
      .max(100)
      .optional(),

    city: z
      .string()
      .max(100)
      .optional(),

    resumeHeadline:
      z.string()
        .max(200)
        .optional(),

    currentRole:
      z.string()
        .max(200)
        .optional(),

    heroIntroduction:
      z.string()
        .max(1000)
        .optional(),

    currentFocus:
      z.string()
        .max(500)
        .optional(),

    availabilityStatus:
      z.string()
        .max(100)
        .optional(),

    allowContactForm:
      z.boolean()
        .optional(),

    allowResumeDownload:
      z.boolean()
        .optional(),

    primaryButtonText:
      z.string()
        .max(50)
        .optional(),

    primaryButtonUrl:
      z.string()
        .url()
        .optional()
        .or(z.literal("")),

    secondaryButtonText:
      z.string()
        .max(50)
        .optional(),

    secondaryButtonUrl:
      z.string()
        .url()
        .optional()
        .or(z.literal("")),

    seoTitle: z
      .string()
      .max(150)
      .optional(),

    seoDescription:
      z.string()
        .max(300)
        .optional(),

    seoKeywords:
      z.string()
        .max(500)
        .optional(),
  });

export const publishPortfolioSchema =
  z.object({
    portfolioId: z
      .string()
      .min(
        1,
        "Portfolio ID is required"
      ),
  });

export const portfolioThemeSchema =
  z.object({
    portfolioId: z
      .string()
      .min(1),

    theme: z.enum([
      "DEFAULT",
      "MODERN",
      "MINIMAL",
      "DARK",
      "DEVELOPER",
    ]),
  });

export type PortfolioInput =
  z.infer<
    typeof portfolioSchema
  >;

export type PublishPortfolioInput =
  z.infer<
    typeof publishPortfolioSchema
  >;

export type PortfolioThemeInput =
  z.infer<
    typeof portfolioThemeSchema
  >;