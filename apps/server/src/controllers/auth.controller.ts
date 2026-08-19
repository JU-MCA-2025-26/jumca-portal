import type { Request, Response } from "express";
import type { GetMeResponse, LoginResponse } from "@jumca/shared";
import authService from "@/services/auth.service.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import "dotenv/config";
import { env } from "@/config/env.js";
import { ApiError } from "@/utils/ApiError.js";
import type { AuthRequest } from "@jumca/shared";

export const refresh = asyncHandler(async (req: Request, res: Response<LoginResponse>) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  const result = await authService.refresh(refreshToken);

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

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body.email, req.body.token, req.body.password);

  res.json({
    success: true,
    message: "Password reset successfully",
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);

  // Returns the same response regardless of whether the email exists or not, to prevent user enumeration.
  res.json({
    success: true,
    message: "If an account exists with that email, a password reset link has been sent.",
  });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = req.user;

  await authService.logout(data!.userId);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response<GetMeResponse>) => {
  const data = req.user;

  const user = await authService.getMe(data!.userId);

  res.json({
    success: true,
    data: {
      user,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response<LoginResponse>) => {
  const data = req.body;

  const result = await authService.login(data);

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
