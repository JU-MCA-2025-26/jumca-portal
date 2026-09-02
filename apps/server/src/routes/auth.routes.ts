import { Router } from "express";

import { loginLimiter, authLimiter, passwordResetLimiter } from "@/middleware/rateLimit.js";

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

import { doubleCsrfProtection } from "@/app.js";
import { loginSchema, resetPasswordSchema, forgotPasswordSchema } from "@jumca/shared";

const router = Router();

router.get("/me", authenticate, getMe);

router.post("/login", doubleCsrfProtection, loginLimiter, validate(loginSchema), login);

router.post("/logout", doubleCsrfProtection, authLimiter, authenticate, logout);

router.post(
  "/forgot-password",
  doubleCsrfProtection,
  passwordResetLimiter,
  validate(forgotPasswordSchema),
  forgotPassword,
);

router.post(
  "/reset-password",
  doubleCsrfProtection,
  passwordResetLimiter,
  validate(resetPasswordSchema),
  resetPassword,
);

router.post("/refresh", doubleCsrfProtection, authLimiter, refresh);

export default router;
