import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2)
      .max(100),

    email: z
      .string()
      .email(),

    password: z
      .string()
      .min(8)
      .max(100),

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

export type RegisterInput = z.infer<
  typeof registerSchema
>;