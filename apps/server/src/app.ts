import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { doubleCsrf } from "csrf-csrf";

import authRoutes from "@/routes/auth.routes.js";
import usersRoutes from "@/routes/user.routes.js";
import placementRoutes from "@/routes/placement.route.js";
import healthRoutes from "@/routes/health.routes.js";

import { errorHandler } from "@/middleware/errorHandler.js";
import { apiLimiter } from "@/middleware/rateLimit.js";
import { env } from "@/config/env.js";
import { API_PREFIX } from "@jumca/shared";

const app = express();

// Security headers
app.use(helmet());

// Cors configuration
app.use(
  cors({
    origin: env.NODE_ENV === "production" && env.CLIENT_URL ? env.CLIENT_URL : "localhost:5173",
    credentials: true,
  }),
);

app.set("trust proxy", 1);

//CSRF protection
const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || "default-csrf-secret",
  getSessionIdentifier: (req) => req.cookies["access_token"] || "anonymous",
  cookieName: "csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});

// Body parsing middleware
app.use(express.json());
app.use(cookieParser(env.COOKIE_SECRET));

// Apply CSRF protection to all routes under the API prefix
app.use(doubleCsrfProtection);

// Logging middleware
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// Rate limiting
app.use(`${API_PREFIX}`, apiLimiter);

// CSRF token generation route
app.get(`${API_PREFIX}/csrf-token`, (req, res) => {
  const token = generateCsrfToken(req, res);
  res.json({ csrfToken: token });
});

// Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, usersRoutes);
app.use(`${API_PREFIX}/placements`, placementRoutes);
app.use(`${API_PREFIX}/health`, healthRoutes);

// Error handling
app.use(errorHandler);

export default app;
