import type { Request, Response } from "express";
import type { HealthResponse } from "@jumca/shared";
import prisma from "@/config/prisma.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const healthCheck = asyncHandler(async (_req: Request, res: Response<HealthResponse>) => {
  await prisma.$queryRaw`SELECT 1`;

  res.status(200).json({
    success: true,
    message: "Server is healthy",
    data: {
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    },
  });
});
