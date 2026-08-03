import bcrypt from "bcrypt";
import prisma from "@/config/prisma.js";
import { generateAccessToken, generateRefreshToken } from "@/config/jwt.js";
import { ApiError } from "@/utils/ApiError.js";

export class AuthService {
  async login(identifier: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { rollNumber: identifier }],
      },
    });

    if (!user) throw new ApiError(404, "User not found");

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) throw new ApiError(401, "Invalid password");

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

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}

export default new AuthService();
