import type { ApiResponse } from "./ApiResponse.js";

interface HealthData {
  status: string;
  database: string;
  timestamp: string;
}

export type HealthResponse = ApiResponse<Partial<HealthData>>;
