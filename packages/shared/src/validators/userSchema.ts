import { z } from "zod";

export const updateUserSchema = z.object({
  email: z.email().optional(),

  fullName: z.string().trim().min(2).max(100).optional(),

  role: z.enum(["STUDENT", "ALUMNI", "ADMIN"]).optional(),

  batch: z.string().trim().min(1).max(50).optional(),

  isActive: z.boolean().optional(),
});

export const createUserSchema = z.object({
  rollNumber: z.string().regex(/^\d{12}$/, "Roll number must be exactly 12 digits"),

  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),

  fullName: z.string().min(2, "Full name is required").max(100, "Full name is too long"),

  role: z.enum(["STUDENT", "ALUMNI", "ADMIN"]),

  batch: z.string().min(1, "Batch is required").max(50, "Batch is too long"),
});

export type CreateRequest = z.infer<typeof createUserSchema>;

export type UpdateRequest = z.infer<typeof updateUserSchema>;
