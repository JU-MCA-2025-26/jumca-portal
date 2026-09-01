import { z } from "zod";

export const sendConnectRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(500, "Message must be 500 characters or fewer"),
});
export type SendConnectRequestBody = z.infer<typeof sendConnectRequestSchema>;

export const respondConnectRequestSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});
export type RespondConnectRequestBody = z.infer<typeof respondConnectRequestSchema>;
