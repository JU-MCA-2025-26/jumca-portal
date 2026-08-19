import { Router } from "express";

import {
  loginLimiter,
  authLimiter,
  passwordResetLimiter
} from "@/middleware/rateLimit.js";

import {
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  refresh,
} from "@/controllers/auth.controller.js";

import { validate } from "@/middleware/validate.js";
import { authenticate } from "@/middleware/authenticate.js";

import {
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema
} from "@jumca/shared";

const router = Router();

router.get(
  "/me",
  authenticate,
  getMe
);

router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  login
);

router.post(
  "/logout",
  authLimiter,
  authenticate,
  logout
);

router.post(
  "/forgot-password",
  passwordResetLimiter,
  validate(forgotPasswordSchema),
  forgotPassword
);

router.post(
  "/reset-password",
  passwordResetLimiter,
  validate(resetPasswordSchema),
  resetPassword
);

router.post(
  "/refresh",
  authLimiter,
  refresh
);

export default router;
