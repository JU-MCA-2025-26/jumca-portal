import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client.ts";
import { AUTH_USER_KEY } from "./me.ts";
import { removeToken } from "@/lib/token-storage.ts";

export const logoutUser = async (): Promise<void> => {
  await apiClient<{ message: string }>("/api/auth/logout", { method: "POST" });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const cleanupAndRedirect = () => {
    // Clear all client-side authentication data
    queryClient.setQueryData(AUTH_USER_KEY, null);
    queryClient.clear();
    removeToken();
    localStorage.removeItem("authUser");
    navigate("/login", { replace: true });
  };

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: cleanupAndRedirect,
    onError: cleanupAndRedirect, // even if logout fails, force client logout
  });
};
