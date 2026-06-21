import { z } from "zod";

export const contactMessageSchema =
  z.object({
    portfolioId: z
      .string()
      .min(
        1,
        "Portfolio is required"
      ),

    visitorName: z
      .string()
      .trim()
      .min(
        2,
        "Name must be at least 2 characters"
      )
      .max(
        100,
        "Name is too long"
      ),

    visitorEmail: z
      .string()
      .trim()
      .email(
        "Invalid email address"
      )
      .max(
        255,
        "Email is too long"
      ),

    note: z
      .string()
      .trim()
      .max(
        2000,
        "Note is too long"
      )
      .optional(),
  });

export const markMessageSeenSchema =
  z.object({
    messageId: z
      .string()
      .min(
        1,
        "Message ID is required"
      ),
  });

export type ContactMessageInput =
  z.infer<
    typeof contactMessageSchema
  >;

export type MarkMessageSeenInput =
  z.infer<
    typeof markMessageSeenSchema
  >;