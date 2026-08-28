import { getToken, setToken, removeToken } from "./token-storage.ts";

const API_BASE = "";

let refreshInFlight: Promise<boolean> | null = null;
let csrfToken: string | null = null;
let csrfTokenInFlight: Promise<string> | null = null;

const getCsrfToken = async (): Promise<string> => {
  if (csrfToken) {
    return csrfToken;
  }

  if (!csrfTokenInFlight) {
    csrfTokenInFlight = fetch(`${API_BASE}/api/csrf-token`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Unable to initialize CSRF protection");
        }

        const data = (await res.json()) as { csrfToken?: string };
        if (!data.csrfToken) {
          throw new Error("CSRF token missing from response");
        }

        csrfToken = data.csrfToken;
        return csrfToken;
      })
      .finally(() => {
        csrfTokenInFlight = null;
      });
  }

  return csrfTokenInFlight;
};

const refreshSession = async (): Promise<boolean> => {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include", // sends the httpOnly refresh token cookie
    })
      .then(async (res) => {
        if (res.ok) {
          // Extract new access token from response
          const data = await res.json();
          if (data?.data?.accessToken) {
            setToken(data.data.accessToken);
            return true;
          }
          // If no token in response, consider it failed
          removeToken();
          return false;
        }
        removeToken();
        return false;
      })
      .catch(() => {
        removeToken();
        return false;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
};

export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const isAuthEndpoint =
    endpoint.includes("/api/auth/refresh") || endpoint.includes("/api/auth/login");
  const method = options.method?.toUpperCase() ?? "GET";
  const requiresCsrfToken = !["GET", "HEAD", "OPTIONS"].includes(method);

  const token = getToken();
  const requestCsrfToken = requiresCsrfToken ? await getCsrfToken() : null;

  const doFetch = () =>
    fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(requestCsrfToken ? { "X-CSRF-Token": requestCsrfToken } : {}),
        ...(token && !isAuthEndpoint ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      credentials: "include",
    });

  let response = await doFetch();

  // Access token expired → try silent refresh once
  if (response.status === 401 && !isAuthEndpoint) {
    const refreshed = await refreshSession();
    if (refreshed) {
      // Retry with new token (doFetch will read updated token from storage)
      response = await doFetch();
    } else {
      // Refresh failed → clear any stored user data and token
      removeToken();
      // Optionally clear user from cache (handled elsewhere)
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Request failed");
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
};
