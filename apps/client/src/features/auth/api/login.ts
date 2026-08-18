import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client.ts";
import { AUTH_USER_KEY } from "./me.ts";
import { type LoginPayload, type LoginApiResponse } from "../types/index.ts";
import { setToken } from "@/lib/token-storage.ts";

export const loginUser = async (payload: LoginPayload): Promise<LoginApiResponse> => {
  return apiClient<LoginApiResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      // Store the access token
      setToken(res.data.accessToken);
      // Cache the user
      queryClient.setQueryData(AUTH_USER_KEY, res.data.user);
      // Persist user for instant render on reload
      localStorage.setItem("authUser", JSON.stringify(res.data.user));
    },
  });
};
