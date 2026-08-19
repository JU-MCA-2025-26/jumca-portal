import type { Request, Response } from "express";
import type { CreateUserResponse, UserParams } from "@jumca/shared";
import { asyncHandler } from "@/utils/asyncHandler.js";
import "dotenv/config";
import userService from "@/services/user.service.js";

export const createUser = asyncHandler(async (req: Request, res: Response<CreateUserResponse>) => {
  const user = await userService.createUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: user,
    },
  });
});

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await userService.getUsers();

  res.json({
    success: true,
    data: users,
  });
});

export const getUserById = asyncHandler(async (req: Request<UserParams>, res: Response) => {
  const user = await userService.getUserById(req.params.userId!);

  res.json({
    success: true,
    data: user,
  });
});

export const updateUser = asyncHandler(async (req: Request<UserParams>, res: Response) => {
  const user = await userService.updateUser(req.params.userId!, req.body);

  res.json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

export const activateUser = asyncHandler(async (req: Request<UserParams>, res: Response) => {
  const user = await userService.activateUser(req.params.userId!);

  res.json({
    success: true,
    message: "User activated successfully",
    data: user,
  });
});

export const deactivateUser = asyncHandler(async (req: Request<UserParams>, res: Response) => {
  const user = await userService.deactivateUser(req.params.userId!);

  res.json({
    success: true,
    message: "User deactivated successfully",
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req: Request<UserParams>, res: Response) => {
  const user = await userService.deleteUser(req.params.userId!);

  res.json({
    success: true,
    message: "User deleted successfully",
    data: user,
  });
});
