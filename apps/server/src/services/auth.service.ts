import type { Role } from "@jumca/shared";

import bcrypt from "bcrypt";
import crypto from "node:crypto";
import prisma from "@/config/prisma.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@/config/jwt.js";
import { ApiError } from "@/utils/ApiError.js";
import { env } from "@/config/env.js";

export class AuthService {
  async refresh(refreshToken: string) {
    let payload: {
      userId: string;
      role: Role;
    };

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const newPayload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: newRefreshToken,
      },
    });

    const safeUser = {
      id: user.id,
      rollNumber: user.rollNumber,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      batch: user.batch,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: safeUser,
    };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const result = await prisma.user.updateMany({
      where: {
        email: normalizedEmail,
        resetPasswordToken: tokenHash,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        refreshToken: null,
      },
    });

    if (result.count !== 1) {
      throw new ApiError(400, "Invalid or expired reset token");
    }
  }

  async forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: resetPasswordExpires,
      },
    });

    const resetPasswordUrl = new URL("/reset-password", env.CLIENT_URL);

    resetPasswordUrl.searchParams.set("email", normalizedEmail);
    resetPasswordUrl.searchParams.set("token", resetToken);

    /*
    TODO: send the reset token to the user's email using any email service provider.
    */
    if (env.NODE_ENV !== "production") {
      console.log(`Password reset URL: ${resetPasswordUrl.toString()}`);
    }
  }

  async logout(userId: string) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        rollNumber: true,
        email: true,
        fullName: true,
        role: true,
        batch: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async login(data: { identifier: string; password: string }) {
    const { identifier, password } = data;

    const normalizedIdentifier = identifier.trim();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: normalizedIdentifier.toLowerCase(),
          },
          {
            rollNumber: normalizedIdentifier,
          },
        ],
      },
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, "Invalid credentials");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new ApiError(401, "Invalid credentials");
    }

    const payload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    const safeUser = {
      id: user.id,
      rollNumber: user.rollNumber,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      batch: user.batch,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }
}

export default new AuthService();
