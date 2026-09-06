import { apiClient } from "@/lib/axios";
import type { ApiResponse, AdminUser, LoginPayload, LoginResult } from "@/types";

/** POST /auth/login */
export async function loginAdmin(payload: LoginPayload) {
  const { data } = await apiClient.post<ApiResponse<LoginResult>>("/auth/login", payload);
  return data.data;
}

/** GET /auth/me — used to rehydrate the session on app load / refresh. */
export async function fetchCurrentAdmin() {
  const { data } = await apiClient.get<ApiResponse<AdminUser>>("/auth/me");
  return data.data;
}

/** POST /auth/logout — best-effort server-side session invalidation. */
export async function logoutAdmin() {
  await apiClient.post("/auth/logout");
}
