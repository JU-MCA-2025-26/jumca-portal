import prisma from "@/config/prisma.js";
import { ApiError } from "@/utils/ApiError.js";

export interface UpdateProfileInput {
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  github?: string;
  leetcode?: string;
  gfg?: string;
  codeforces?: string;
  linkedinUrl?: string;
  company?: string;
  jobRole?: string;
  location?: string;
  tags?: string[];
  graduationYear?: number;
  openToConnect?: boolean;
}

class ProfileService {
  async getMyProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  async updateMyProfile(userId: string, data: UpdateProfileInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (data.fullName && data.fullName.trim() !== user.fullName) {
      await prisma.user.update({
        where: { id: userId },
        data: { fullName: data.fullName.trim() },
      });
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      update: {
        avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : undefined,
        bio: data.bio !== undefined ? data.bio : undefined,
        github: data.github !== undefined ? data.github : undefined,
        leetcode: data.leetcode !== undefined ? data.leetcode : undefined,
        gfg: data.gfg !== undefined ? data.gfg : undefined,
        codeforces: data.codeforces !== undefined ? data.codeforces : undefined,
        linkedinUrl: data.linkedinUrl !== undefined ? data.linkedinUrl : undefined,
        company: data.company !== undefined ? data.company : undefined,
        jobRole: data.jobRole !== undefined ? data.jobRole : undefined,
        location: data.location !== undefined ? data.location : undefined,
        tags: data.tags !== undefined ? data.tags : undefined,
        graduationYear: data.graduationYear !== undefined ? data.graduationYear : undefined,
        openToConnect: data.openToConnect !== undefined ? data.openToConnect : undefined,
      },
      create: {
        userId,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        github: data.github,
        leetcode: data.leetcode,
        gfg: data.gfg,
        codeforces: data.codeforces,
        linkedinUrl: data.linkedinUrl,
        company: data.company,
        jobRole: data.jobRole,
        location: data.location,
        tags: data.tags ?? [],
        graduationYear: data.graduationYear,
        openToConnect: data.openToConnect ?? false,
      },
    });

    const result = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        rollNumber: true,
        email: true,
        fullName: true,
        role: true,
        batch: true,
        isActive: true,
        createdAt: true,
        profile: true,
      },
    });

    return result;
  }
}

export const profileService = new ProfileService();
export default profileService;
