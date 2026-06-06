import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    token: z.string(),

    password: z
      .string()
      .min(8),

    confirmPassword: z
      .string()
      .min(8),
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