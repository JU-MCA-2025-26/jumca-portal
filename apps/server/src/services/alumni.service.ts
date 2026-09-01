import type { AlumniListItem, AlumniProfile, ConnectRequest } from "@jumca/shared";

import prisma from "@/config/prisma.js";
import { ApiError } from "@/utils/ApiError.js";

import { Role, ConnectRequestStatus } from "@/generated/enums.js";
import type { Profile, User } from "@/generated/client.js";

type UserWithProfile = User & { profile: Profile | null };

type ConnectRequestWithUsers = {
  id: string;
  message: string | null;
  status: ConnectRequestStatus;
  createdAt: Date;
  requester: UserWithProfile;
  alumni: UserWithProfile;
};

interface ListAlumniOptions {
  search?: string;
  year?: number;
  page?: number;
  limit?: number;
}

export class AlumniService {
  async getAlumniList({ search, year, page = 1, limit = 20 }: ListAlumniOptions) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));

    const where: Record<string, unknown> = {
      role: Role.ALUMNI,
      isActive: true,
    };

    if (year) {
      where.profile = { graduationYear: year };
    }

    if (search?.trim()) {
      const term = search.trim();
      where.OR = [
        { fullName: { contains: term, mode: "insensitive" } },
        { profile: { company: { contains: term, mode: "insensitive" } } },
        { profile: { jobRole: { contains: term, mode: "insensitive" } } },
        { profile: { location: { contains: term, mode: "insensitive" } } },
        { profile: { tags: { has: term } } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        include: { profile: true },
        orderBy: { fullName: "asc" },
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
    ]);

    return {
      data: users.map(this.toAlumniListItem),
      total,
      page: safePage,
      limit: safeLimit,
    };
  }

  async getGraduationYears() {
    const rows = await prisma.profile.findMany({
      where: {
        user: { role: Role.ALUMNI, isActive: true },
        graduationYear: { not: null },
      },
      select: { graduationYear: true },
      distinct: ["graduationYear"],
      orderBy: { graduationYear: "desc" },
    });

    return rows.map((row) => row.graduationYear).filter((year): year is number => year !== null);
  }

  async getAlumniProfile(id: string): Promise<AlumniProfile> {
    const user = await prisma.user.findFirst({
      where: { id, role: Role.ALUMNI, isActive: true },
      include: { profile: true },
    });

    if (!user) {
      throw new ApiError(404, "Alumni not found");
    }

    return this.toAlumniProfile(user);
  }

  async sendConnectRequest(
    requesterId: string,
    alumniId: string,
    message: string,
  ): Promise<ConnectRequest> {
    if (requesterId === alumniId) {
      throw new ApiError(400, "You cannot send a connect request to yourself");
    }

    const alumni = await prisma.user.findFirst({
      where: { id: alumniId, role: Role.ALUMNI, isActive: true },
      include: { profile: true },
    });

    if (!alumni) {
      throw new ApiError(404, "Alumni not found");
    }

    if (!alumni.profile?.openToConnect) {
      throw new ApiError(400, "This alumni is not currently open to connect requests");
    }

    const existingPending = await prisma.connectRequest.findFirst({
      where: { requesterId, alumniId, status: ConnectRequestStatus.PENDING },
    });

    if (existingPending) {
      throw new ApiError(409, "You already have a pending connect request with this alumni");
    }

    const request = await prisma.connectRequest.create({
      data: { requesterId, alumniId, message: message.trim() },
      include: {
        requester: { include: { profile: true } },
        alumni: { include: { profile: true } },
      },
    });

    return this.toConnectRequestDto(request);
  }

  async getIncomingConnectRequests(alumniId: string): Promise<ConnectRequest[]> {
    const requests = await prisma.connectRequest.findMany({
      where: { alumniId },
      include: {
        requester: { include: { profile: true } },
        alumni: { include: { profile: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return requests.map(this.toConnectRequestDto);
  }

  async getOutgoingConnectRequests(requesterId: string): Promise<ConnectRequest[]> {
    const requests = await prisma.connectRequest.findMany({
      where: { requesterId },
      include: {
        requester: { include: { profile: true } },
        alumni: { include: { profile: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return requests.map(this.toConnectRequestDto);
  }

  async respondToConnectRequest(
    connectRequestId: string,
    alumniId: string,
    status: "APPROVED" | "REJECTED",
  ): Promise<ConnectRequest> {
    const existing = await prisma.connectRequest.findUnique({ where: { id: connectRequestId } });

    if (!existing || existing.alumniId !== alumniId) {
      throw new ApiError(404, "Connect request not found");
    }

    if (existing.status !== ConnectRequestStatus.PENDING) {
      throw new ApiError(409, "This request has already been responded to");
    }

    const updated = await prisma.connectRequest.update({
      where: { id: connectRequestId },
      data: {
        status:
          status === "APPROVED" ? ConnectRequestStatus.APPROVED : ConnectRequestStatus.REJECTED,
      },
      include: {
        requester: { include: { profile: true } },
        alumni: { include: { profile: true } },
      },
    });

    return this.toConnectRequestDto(updated);
  }

  // ── Mappers (arrow properties so `this` is bound when passed to .map()) ──
  private toAlumniListItem = (user: UserWithProfile): AlumniListItem => ({
    id: user.id,
    fullName: user.fullName,
    batch: user.batch,
    graduationYear: user.profile?.graduationYear ?? null,
    avatarUrl: user.profile?.avatarUrl ?? null,
    company: user.profile?.company ?? null,
    jobRole: user.profile?.jobRole ?? null,
    location: user.profile?.location ?? null,
    tags: user.profile?.tags ?? [],
    openToConnect: user.profile?.openToConnect ?? false,
  });

  private toAlumniProfile = (user: UserWithProfile): AlumniProfile => ({
    ...this.toAlumniListItem(user),
    rollNumber: user.rollNumber,
    bio: user.profile?.bio ?? null,
    github: user.profile?.github ?? null,
    leetcode: user.profile?.leetcode ?? null,
    gfg: user.profile?.gfg ?? null,
    codeforces: user.profile?.codeforces ?? null,
    linkedinUrl: user.profile?.linkedinUrl ?? null,
  });

  private toConnectRequestDto = (request: ConnectRequestWithUsers): ConnectRequest => ({
    id: request.id,
    message: request.message,
    status: request.status,
    createdAt: request.createdAt.toISOString(),
    requester: {
      id: request.requester.id,
      fullName: request.requester.fullName,
      batch: request.requester.batch,
      avatarUrl: request.requester.profile?.avatarUrl ?? null,
    },
    alumni: {
      id: request.alumni.id,
      fullName: request.alumni.fullName,
      batch: request.alumni.batch,
      avatarUrl: request.alumni.profile?.avatarUrl ?? null,
    },
  });
}

export default new AlumniService();
