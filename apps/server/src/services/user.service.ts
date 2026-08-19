import type { Role } from "@jumca/shared/api/Role.js";

import bcrypt from "bcrypt";
import prisma from "@/config/prisma.js";
import { ApiError } from "@/utils/ApiError.js";

import { Role as Roles } from "@/generated/enums.js";

export class UserService {
  async createUser(data: {
    rollNumber: string;
    email: string;
    password: string;
    fullName: string;
    role: Role;
    batch: string;
  }) {
    const { rollNumber, email, password, fullName, role, batch } = data;

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedRollNumber = rollNumber.trim();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { rollNumber: normalizedRollNumber }],
      },
    });

    if (existingUser) {
      if (existingUser.rollNumber === normalizedRollNumber) {
        throw new ApiError(409, "A user with this roll number already exists");
      }

      throw new ApiError(409, "A user with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        rollNumber: normalizedRollNumber,
        email: normalizedEmail,
        password: hashedPassword,
        fullName: fullName.trim(),
        role,
        batch: batch.trim(),
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

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async getUsers() {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
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

    return users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
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

  async updateUser(
    id: string,
    data: {
      email?: string;
      fullName?: string;
      role?: Role;
      batch?: string;
      isActive?: boolean;
    },
  ) {
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    if (data.email) {
      const normalizedEmail = data.email.trim().toLowerCase();

      const emailOwner = await prisma.user.findFirst({
        where: {
          email: normalizedEmail,
          NOT: {
            id,
          },
        },
      });

      if (emailOwner) {
        throw new ApiError(409, "A user with this email already exists");
      }

      data.email = normalizedEmail;
    }

    const user = await prisma.user.update({
      where: {
        id,
      },

      data: {
        email: data.email,
        fullName: data.fullName?.trim(),
        role: data.role,
        batch: data.batch?.trim(),
        isActive: data.isActive,
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

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async activateUser(id: string) {
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    const user = await prisma.user.update({
      where: {
        id,
      },

      data: {
        isActive: true,
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

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async deactivateUser(id: string) {
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    if (existingUser.role === Roles.ADMIN) {
      throw new ApiError(403, "Cannot deactivate an admin");
    }

    const user = await prisma.user.update({
      where: {
        id,
      },

      data: {
        isActive: false,
        refreshToken: null,
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

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async deleteUser(id: string) {
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    if (existingUser.role === Roles.ADMIN) {
      throw new ApiError(403, "Cannot delete an admin");
    }

    const user = await prisma.user.delete({
      where: {
        id,
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

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

export default new UserService();
