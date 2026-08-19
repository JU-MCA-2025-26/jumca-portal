import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client.ts";
import { type AuthUser, type MeApiResponse } from "../types/index.ts";
import { removeToken } from "@/lib/token-storage.ts";

export const AUTH_USER_KEY = ["auth-user"] as const;

export const fetchCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const res = await apiClient<MeApiResponse>("/api/auth/me");
    return res.data;
  } catch {
    // If the request fails (e.g., 401), the token is likely invalid.
    // Clean up and return null.
    removeToken();
    localStorage.removeItem("authUser");
    return null;
  }
};

export const useCurrentUser = () => {
  // Read stored user for immediate display
  const storedUser = localStorage.getItem("authUser");
  const initialData = storedUser ? JSON.parse(storedUser) : undefined;

  return useQuery({
    queryKey: AUTH_USER_KEY,
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    initialData,
  });
};
