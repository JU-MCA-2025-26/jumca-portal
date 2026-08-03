import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "@/routes/auth.routes.js";
import healthRoutes from "@/routes/health.routes.js";

import { errorHandler } from "@/middleware/errorHandler.js";
import { env } from "@/config/env.js";
import { API_PREFIX } from "@jumca/shared";

const app = express();

// Security headers
app.use(helmet());

// Cors configuration
app.use(
  cors({
    origin: env.NODE_ENV === "production" && env.CLIENT_URL ? env.CLIENT_URL : "*",
    credentials: true,
  }),
);

// Body parsing middleware
app.use(express.json());
app.use(cookieParser());

// Logging middleware
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/health`, healthRoutes);

// Error handling
app.use(errorHandler);

export default app;
