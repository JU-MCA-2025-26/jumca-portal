import jwt from "jsonwebtoken";
import "dotenv/config";
import type { StringValue } from "ms";
import { env } from "@/config/env.js";

const ACCESS_SECRET = env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = env.JWT_REFRESH_SECRET!;

export interface JwtPayload {
  userId: string;
  role: string;
}

export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: (env.ACCESS_TOKEN_EXPIRES || "15m") as StringValue,
  });
};

export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: (env.REFRESH_TOKEN_EXPIRES || "7d") as StringValue,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};
