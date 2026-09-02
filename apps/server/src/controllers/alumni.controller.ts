import type { Request, Response } from "express";
import type {
  AuthRequest,
  GetAlumniListResponse,
  GetAlumniProfileResponse,
  GetConnectRequestsResponse,
  GetGraduationYearsResponse,
  RespondConnectRequestResponse,
  SendConnectRequestResponse,
} from "@jumca/shared";
import { asyncHandler } from "@/utils/asyncHandler.js";
import alumniService from "@/services/alumni.service.js";

export const getAlumniList = asyncHandler(
  async (req: Request, res: Response<GetAlumniListResponse>) => {
    const { search, year, page, limit } = req.query;

    const result = await alumniService.getAlumniList({
      search: typeof search === "string" ? search : undefined,
      year: year ? Number(year) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    res.json({
      success: true,
      data: result,
    });
  },
);

export const getGraduationYears = asyncHandler(
  async (_req: Request, res: Response<GetGraduationYearsResponse>) => {
    const years = await alumniService.getGraduationYears();

    res.json({
      success: true,
      data: years,
    });
  },
);

export const getAlumniProfile = asyncHandler(
  async (req: Request, res: Response<GetAlumniProfileResponse>) => {
    const { id } = req.params as { id: string };
    const profile = await alumniService.getAlumniProfile(id!);

    res.json({
      success: true,
      data: profile,
    });
  },
);

export const sendConnectRequest = asyncHandler(
  async (req: AuthRequest, res: Response<SendConnectRequestResponse>) => {
    const { id } = req.params as { id: string };
    const requesterId = req.user!.userId;
    const { message } = req.body;

    const request = await alumniService.sendConnectRequest(requesterId, id!, message);

    res.status(201).json({
      success: true,
      message: "Connect request sent",
      data: request,
    });
  },
);

export const getIncomingConnectRequests = asyncHandler(
  async (req: AuthRequest, res: Response<GetConnectRequestsResponse>) => {
    const requests = await alumniService.getIncomingConnectRequests(req.user!.userId);

    res.json({
      success: true,
      data: requests,
    });
  },
);

export const getOutgoingConnectRequests = asyncHandler(
  async (req: AuthRequest, res: Response<GetConnectRequestsResponse>) => {
    const requests = await alumniService.getOutgoingConnectRequests(req.user!.userId);

    res.json({
      success: true,
      data: requests,
    });
  },
);

export const respondToConnectRequest = asyncHandler(
  async (req: AuthRequest, res: Response<RespondConnectRequestResponse>) => {
    const { status } = req.body;
    const { id } = req.params as { id: string };

    const request = await alumniService.respondToConnectRequest(id!, req.user!.userId, status);

    res.json({
      success: true,
      message: `Connect request ${status.toLowerCase()}`,
      data: request,
    });
  },
);
