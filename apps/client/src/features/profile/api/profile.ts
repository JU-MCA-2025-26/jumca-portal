import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client.ts";
import { AUTH_USER_KEY } from "@/features/auth/api/me.ts";
import type { AuthUser } from "@/features/auth/types/index.ts";

// Update profile payload
export interface UpdateProfilePayload {
  bio?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  leetcode?: string;
  gfg?: string;
  codeforces?: string;
  portfolio?: string;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      apiClient<UpdateProfileResponse>("/api/profile/me", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: (res) => {
      // Update auth cache in-place — no refetch needed
      queryClient.setQueryData(AUTH_USER_KEY, res.data);
    },
  });
};
