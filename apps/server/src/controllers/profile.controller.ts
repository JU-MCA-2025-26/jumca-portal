import type { Response } from "express";
import type { AuthRequest } from "@jumca/shared";
import { asyncHandler } from "@/utils/asyncHandler.js";
import profileService from "@/services/profile.service.js";

export const getMyProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await profileService.getMyProfile(req.user!.userId);
  res.json({
    success: true,
    data: user,
  });
});

export const updateMyProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const updatedUser = await profileService.updateMyProfile(req.user!.userId, req.body);
  res.json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});
