import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client.ts";
import type {
  PlacementStats,
  PlacementDriveSummary,
  PlacementDriveDetail,
  DriveSector,
} from "../types/index.ts";
import { type ApiResponse } from "@jumca/shared";

// Stats
export const usePlacementStats = () =>
  useQuery<PlacementStats, Error>({
    queryKey: ["placement-stats"],
    queryFn: () =>
      apiClient<ApiResponse<PlacementStats>>("/api/placements/stats").then((r) => r.data),
    staleTime: 1000 * 60 * 10,
  });

// Drive list
export const usePlacementDrives = (sector: DriveSector = "ALL") =>
  useQuery<PlacementDriveSummary[], Error>({
    queryKey: ["placement-drives", sector],
    queryFn: () => {
      const url =
        sector !== "ALL" ? `/api/placements/drives?sector=${sector}` : "/api/placements/drives";
      return apiClient<ApiResponse<PlacementDriveSummary[]>>(url).then((r) => r.data);
    },
    staleTime: 1000 * 60 * 2,
  });

// Drive detail (enabled only when an id is selected)
export const useDriveDetail = (driveId: string | null) =>
  useQuery<PlacementDriveDetail, Error>({
    queryKey: ["placement-drive", driveId],
    queryFn: () =>
      apiClient<ApiResponse<PlacementDriveDetail>>(`/api/placements/drives/${driveId!}`).then(
        (r) => r.data,
      ),
    enabled: !!driveId,
    staleTime: 1000 * 60 * 5,
  });
