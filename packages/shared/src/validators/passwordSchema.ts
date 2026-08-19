import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z.object({
  email: z.email(),

  token: z.string().min(1),

  password: z.string().min(8).max(72),
});
