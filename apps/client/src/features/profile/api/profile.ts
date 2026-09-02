import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client.ts";
import { AUTH_USER_KEY } from "@/features/auth/api/me.ts";
import type { AuthUser } from "@/features/auth/types/index.ts";

// Update profile payload
export interface UpdateProfilePayload {
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  github?: string;
  linkedinUrl?: string;
  leetcode?: string;
  gfg?: string;
  codeforces?: string;
  tags?: string[];
  company?: string;
  jobRole?: string;
  location?: string;
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
