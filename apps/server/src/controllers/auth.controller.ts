import type { Request, Response } from "express";
import type { LoginResponse } from "@jumca/shared";
import authService from "@/services/auth.service.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import "dotenv/config";
import { env } from "@/config/env.js";

export const login = asyncHandler(async (req: Request, res: Response<LoginResponse>) => {
  const { identifier, password } = req.body;

  const result = await authService.login(identifier, password);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({
    success: true,
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});
