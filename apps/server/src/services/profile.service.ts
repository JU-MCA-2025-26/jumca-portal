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

// Simple sanitizers/validators to mitigate stored XSS/SSRF risks flagged by CodeQL
function sanitizeString(val?: string | null, maxLen = 256): string | undefined {
  if (!val) return undefined;
  const s = String(val).trim();
  if (s.length === 0) return undefined;
  return s.slice(0, maxLen);
}

function sanitizeUrl(val?: string | null): string | undefined {
  if (!val) return undefined;
  const s = String(val).trim();
  if (s.length === 0) return undefined;

  // Allow absolute http(s) URLs, root-relative paths, and data URIs for images.
  // Reject javascript: and other potentially dangerous schemes.
  if (/^\s*javascript:/i.test(s)) return undefined;
  if (/^(https?:\/\/|\/|data:image\/)/i.test(s)) return s;
  // Not a supported URL - drop it
  return undefined;
}

function sanitizeTags(tags?: unknown): string[] | undefined {
  if (!Array.isArray(tags)) return undefined;
  const filtered = tags
    .filter((t) => typeof t === "string")
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .slice(0, 50) // cap number of tags
    .map((t) => t.slice(0, 50));
  return filtered.length ? filtered : [];
}

function sanitizeYear(y?: unknown): number | undefined {
  if (typeof y === "number" && Number.isInteger(y)) return y;
  if (typeof y === "string" && /^\d{4}$/.test(y)) return parseInt(y, 10);
  return undefined;
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

    // Update full name if provided and changed (sanitized)
    const newFullName = sanitizeString(data.fullName, 128);
    if (newFullName && newFullName !== user.fullName) {
      await prisma.user.update({
        where: { id: userId },
        data: { fullName: newFullName },
      });
    }

    // Build sanitized payload for profile upsert to avoid storing malicious/invalid values
    const sanitizedAvatar = sanitizeUrl(data.avatarUrl);
    const sanitizedBio = sanitizeString(data.bio, 1024);
    const sanitizedGithub = sanitizeUrl(data.github);
    const sanitizedLeet = sanitizeUrl(data.leetcode) || sanitizeString(data.leetcode, 128);
    const sanitizedGfg = sanitizeUrl(data.gfg) || sanitizeString(data.gfg, 128);
    const sanitizedCF = sanitizeUrl(data.codeforces) || sanitizeString(data.codeforces, 128);
    const sanitizedLinkedin = sanitizeUrl(data.linkedinUrl);
    const sanitizedCompany = sanitizeString(data.company, 128);
    const sanitizedJobRole = sanitizeString(data.jobRole, 128);
    const sanitizedLocation = sanitizeString(data.location, 128);
    const sanitizedTags = sanitizeTags(data.tags);
    const sanitizedGradYear = sanitizeYear(data.graduationYear);
    const sanitizedOpenToConnect = typeof data.openToConnect === "boolean" ? data.openToConnect : undefined;

    await prisma.profile.upsert({
      where: { userId },
      update: {
        avatarUrl: sanitizedAvatar !== undefined ? sanitizedAvatar : undefined,
        bio: sanitizedBio !== undefined ? sanitizedBio : undefined,
        github: sanitizedGithub !== undefined ? sanitizedGithub : undefined,
        leetcode: sanitizedLeet !== undefined ? sanitizedLeet : undefined,
        gfg: sanitizedGfg !== undefined ? sanitizedGfg : undefined,
        codeforces: sanitizedCF !== undefined ? sanitizedCF : undefined,
        linkedinUrl: sanitizedLinkedin !== undefined ? sanitizedLinkedin : undefined,
        company: sanitizedCompany !== undefined ? sanitizedCompany : undefined,
        jobRole: sanitizedJobRole !== undefined ? sanitizedJobRole : undefined,
        location: sanitizedLocation !== undefined ? sanitizedLocation : undefined,
        tags: sanitizedTags !== undefined ? sanitizedTags : undefined,
        graduationYear: sanitizedGradYear !== undefined ? sanitizedGradYear : undefined,
        openToConnect: sanitizedOpenToConnect !== undefined ? sanitizedOpenToConnect : undefined,
      },
      create: {
        userId,
        avatarUrl: sanitizedAvatar ?? null,
        bio: sanitizedBio ?? null,
        github: sanitizedGithub ?? null,
        leetcode: sanitizedLeet ?? null,
        gfg: sanitizedGfg ?? null,
        codeforces: sanitizedCF ?? null,
        linkedinUrl: sanitizedLinkedin ?? null,
        company: sanitizedCompany ?? null,
        jobRole: sanitizedJobRole ?? null,
        location: sanitizedLocation ?? null,
        tags: sanitizedTags ?? [],
        graduationYear: sanitizedGradYear ?? null,
        openToConnect: sanitizedOpenToConnect ?? false,
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
