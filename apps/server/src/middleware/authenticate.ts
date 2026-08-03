import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "@/types/AuthRequest.js";
import { env } from "@/config/env.js";

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/, "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET!) as AuthRequest["user"];
    req.user = decoded!;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
