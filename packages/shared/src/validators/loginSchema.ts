import { z } from "zod";

export const loginSchema = z
  .object({
    identifier: z
      .email({ error: "Invalid email format" })
      .or(z.string().regex(/^\d{12}$/, { error: "Roll number must be exactly 12 digits" })),
    password: z.string().min(8, { error: "Password must be at least 8 characters long" }),
  })
  .strict();

export type LoginRequest = z.infer<typeof loginSchema>;
