import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .trim()
      .min(1, "Invalid reset token"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long"),

    confirmPassword: z
      .string()
      .min(8, "Confirm password is required"),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

export type ResetPasswordInput =
  z.infer<typeof resetPasswordSchema>;