import type { Response, NextFunction } from "express";
import type { AuthRequest } from "@/types/AuthRequest.js";
import { Role } from "@/generated/enums.js";

export const authorize =
  (...roles: Role[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role as Role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
