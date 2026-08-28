import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { ApiError } from "@/utils/ApiError.js";
import placementService from "@/services/placement.service.js";

// GET /api/placements/stats
export const placementStats = asyncHandler(async (_req: Request, res: Response) => {
  const data = await placementService.getPlacementStats();
  res.status(200).json({ success: true, message: "Placement stats", data });
});

// GET /api/placements/drives[?sector=PRODUCT]
export const listDrives = asyncHandler(async (req: Request, res: Response) => {
  const sector =
    typeof req.query["sector"] === "string" ? req.query["sector"].toUpperCase() : undefined;

  const data = await placementService.getPlacementDrives(sector);
  res.status(200).json({ success: true, message: "Placement drives", data });
});

// GET /api/placements/drives/:id
export const getDrive = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const data = await placementService.getDriveById(id);

  if (!data) throw new ApiError(404, "Drive not found");

  res.status(200).json({ success: true, message: "Drive detail", data });
});
