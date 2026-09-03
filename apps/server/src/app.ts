import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import session from "express-session";
import pgSession from "connect-pg-simple";
import lusca from "lusca";
import pg from "pg";

import authRoutes from "@/routes/auth.routes.js";
import usersRoutes from "@/routes/user.routes.js";
import placementRoutes from "@/routes/placement.route.js";
import alumniRoutes from "@/routes/alumni.routes.js";
import profileRoutes from "@/routes/profile.routes.js";
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
    origin: env.NODE_ENV === "production" && env.CLIENT_URL ? env.CLIENT_URL : "http://localhost:5173",
    credentials: true,
  }),
);

app.set("trust proxy", 1);

// Body parsing middleware
app.use(express.json());
app.use(cookieParser(env.COOKIE_SECRET));

// Session store (required by lusca's CSRF module)
const pgPool = new pg.Pool({ connectionString: env.DATABASE_URL });

app.use(
  session({
    store: new (pgSession(session))({ pool: pgPool }),
    secret: env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);

// CSRF protection
app.use((req, res, next) => {
  // Skip CSRF validation for safe HTTP methods (GET, HEAD, OPTIONS) and public auth endpoints
  if (
    ["GET", "HEAD", "OPTIONS"].includes(req.method) ||
    req.path.startsWith(`${API_PREFIX}/auth/login`) ||
    req.path.startsWith(`${API_PREFIX}/auth/register`) ||
    req.path.startsWith(`${API_PREFIX}/auth/refresh`)
  ) {
    return next();
  }
  lusca.csrf({ header: "x-csrf-token" })(req, res, next);
});

// Logging middleware
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// Rate limiting
app.use(`${API_PREFIX}`, apiLimiter);

// CSRF token generation route (public endpoint to retrieve token)
app.get(`${API_PREFIX}/csrf-token`, lusca.csrf({ header: "x-csrf-token" }), (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.json({ csrfToken: res.locals._csrf });
});

// Health route (public)
app.use(`${API_PREFIX}/health`, healthRoutes);

// Authenticated/State-modifying API Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, usersRoutes);
app.use(`${API_PREFIX}/placements`, placementRoutes);
app.use(`${API_PREFIX}/alumni`, alumniRoutes);
app.use(`${API_PREFIX}/profile`, profileRoutes);

// Error handling
app.use(errorHandler);

export default app;
