import { Router } from "express";
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
import { loginSchema, resetPasswordSchema, forgotPasswordSchema } from "@jumca/shared";

const router = Router();

router.get("/me", authenticate, getMe);

router.post("/login", validate(loginSchema), login);
router.post("/logout", authenticate, logout);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/refresh", refresh);

export default router;
