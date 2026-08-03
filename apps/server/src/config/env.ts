import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CLIENT_URL: z.url().default("http://localhost:5173"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url(),
  JWT_ACCESS_SECRET: z.string().min(43),
  JWT_REFRESH_SECRET: z.string().min(43),
  ACCESS_TOKEN_EXPIRES: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES: z.string().default("7d"),
});

export const env = envSchema.parse(process.env);
