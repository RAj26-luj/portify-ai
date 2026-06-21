import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(255, "Email is too long"),
});

export type ForgotPasswordInput =
  z.infer<typeof forgotPasswordSchema>;