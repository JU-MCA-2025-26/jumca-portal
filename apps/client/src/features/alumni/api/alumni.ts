import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client.ts";
import type {
  ConnectRequestStatus,
  GetAlumniListResponse,
  GetAlumniProfileResponse,
  GetConnectRequestsResponse,
  GetGraduationYearsResponse,
  RespondConnectRequestResponse,
  SendConnectRequestResponse,
} from "@jumca/shared";

export interface AlumniListParams {
  search?: string;
  year?: number;
  page?: number;
  limit?: number;
}

function buildQuery(params: AlumniListParams): string {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.year) query.set("year", String(params.year));
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export const ALUMNI_LIST_KEY = (params: AlumniListParams) => ["alumni", "list", params] as const;
export const ALUMNI_YEARS_KEY = ["alumni", "years"] as const;
export const ALUMNI_PROFILE_KEY = (id: string) => ["alumni", "profile", id] as const;
export const INCOMING_CONNECT_REQUESTS_KEY = ["alumni", "connect-requests", "incoming"] as const;
export const OUTGOING_CONNECT_REQUESTS_KEY = ["alumni", "connect-requests", "outgoing"] as const;

export const useAlumniList = (params: AlumniListParams = {}) =>
  useQuery({
    queryKey: ALUMNI_LIST_KEY(params),
    queryFn: () => apiClient<GetAlumniListResponse>(`/api/alumni${buildQuery(params)}`),
  });

export const useGraduationYears = () =>
  useQuery({
    queryKey: ALUMNI_YEARS_KEY,
    queryFn: () => apiClient<GetGraduationYearsResponse>("/api/alumni/years"),
    staleTime: 5 * 60 * 1000,
  });

export const useAlumniProfile = (id: string | undefined) =>
  useQuery({
    queryKey: ALUMNI_PROFILE_KEY(id ?? ""),
    queryFn: () => apiClient<GetAlumniProfileResponse>(`/api/alumni/${id}`),
    enabled: Boolean(id),
  });

// Connect requests
export const useSendConnectRequest = (alumniId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: string) =>
      apiClient<SendConnectRequestResponse>(`/api/alumni/${alumniId}/connect`, {
        method: "POST",
        body: JSON.stringify({ message }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALUMNI_PROFILE_KEY(alumniId) });
      queryClient.invalidateQueries({ queryKey: OUTGOING_CONNECT_REQUESTS_KEY });
    },
  });
};

export const useIncomingConnectRequests = () =>
  useQuery({
    queryKey: INCOMING_CONNECT_REQUESTS_KEY,
    queryFn: () => apiClient<GetConnectRequestsResponse>("/api/alumni/connect-requests/incoming"),
  });

export const useOutgoingConnectRequests = () =>
  useQuery({
    queryKey: OUTGOING_CONNECT_REQUESTS_KEY,
    queryFn: () => apiClient<GetConnectRequestsResponse>("/api/alumni/connect-requests/outgoing"),
  });

export const useRespondToConnectRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: Extract<ConnectRequestStatus, "APPROVED" | "REJECTED">;
    }) =>
      apiClient<RespondConnectRequestResponse>(`/api/alumni/connect-requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCOMING_CONNECT_REQUESTS_KEY });
    },
  });
};
