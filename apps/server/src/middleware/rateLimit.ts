import { rateLimit } from "express-rate-limit";
import { ApiError } from "@/utils/ApiError.js";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (_req, _res, next, options) => {
    next(new ApiError(429, options.message));
  },

  message: "Too many requests. Please try again later.",
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (_req, _res, next, options) => {
    next(new ApiError(429, options.message));
  },

  message: "Too many authentication requests. Please try again later.",
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (_req, _res, next, options) => {
    next(new ApiError(429, options.message));
  },

  message: "Too many login attempts. Please try again in 15 minutes.",
});

export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (_req, _res, next, options) => {
    next(new ApiError(429, options.message));
  },

  message: "Too many password reset requests. Please try again later.",
});
