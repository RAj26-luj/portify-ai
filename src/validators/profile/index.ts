import { z } from "zod";

export const profileSchema = z.object({
  // User Fields
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  username: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  city: z.string().optional().nullable(),

  // Portfolio Fields
  title: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),

  profileImage: z.string().optional().nullable(),
  coverPortfolioImage: z.string().optional().nullable(),

  resumeHeadline: z.string().optional().nullable(),
  currentRole: z.string().optional().nullable(),

  phonePortfolio: z.string().optional().nullable(),
  emailPortfolio: z.string().optional().nullable(),
  websitePortfolio: z.string().optional().nullable(),

  countryPortfolio: z.string().optional().nullable(),
  statePortfolio: z.string().optional().nullable(),
  cityPortfolio: z.string().optional().nullable(),

  timezone: z.string().optional().nullable(),

  allowContactForm: z.boolean().default(true),
  allowResumeDownload: z.boolean().default(true),

  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  seoImage: z.string().optional().nullable(),

  ogTitle: z.string().optional().nullable(),
  ogSubtitle: z.string().optional().nullable(),
  ogDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),

  primaryButtonText: z.string().optional().nullable(),
  primaryButtonUrl: z.string().optional().nullable(),

  secondaryButtonText: z.string().optional().nullable(),
  secondaryButtonUrl: z.string().optional().nullable(),

  currentFocus: z.string().optional().nullable(),
  availabilityStatus: z.string().optional().nullable(),

  aboutImage: z.string().optional().nullable(),

  contactAvailability: z.string().optional().nullable(),

  twitterImage: z.string().optional().nullable(),

  description: z.string().optional().nullable(),

  heroIntroduction: z.string().optional().nullable(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export type ProfileUpdateDTO = Omit<
  ProfileFormValues,
  "email" | "username"
>;