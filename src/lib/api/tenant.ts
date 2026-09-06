import { apiClient } from "@/lib/axios";
import type { ApiResponse, PaginatedData, Tenant, TenantFormInput, TenantStats } from "@/types";

/** GET /tenants?page=&limit=&search= */
export async function fetchTenants(params: { page?: number; limit?: number; search?: string }) {
  const { data } = await apiClient.get<ApiResponse<PaginatedData<Tenant>>>("/tenants", {
    params,
  });
  return data.data;
}

/** GET /tenants/:id */
export async function fetchTenantByUuid(uuid: string) {
  const { data } = await apiClient.get<ApiResponse<Tenant>>(`/tenants/${uuid}`);
  return data.data;
}

/** POST /tenants */
export async function createTenant(payload: TenantFormInput) {
  const { data } = await apiClient.post<ApiResponse<Tenant>>("/tenants", payload);
  return data.data;
}

/** PUT /tenants/:id */
export async function updateTenant(uuid: string, payload: TenantFormInput) {
  const { data } = await apiClient.put<ApiResponse<Tenant>>(`/tenants/${uuid}`, payload);
  return data.data;
}

/** DELETE /tenants/:id */
export async function deleteTenant(uuid: string) {
  await apiClient.delete(`/tenants/${uuid}`);
}

/** GET /tenants/:id/stats — powers the admin dashboard charts. */
export async function fetchTenantStats(uuid: string) {
  const { data } = await apiClient.get<ApiResponse<TenantStats>>(`/tenants/${uuid}/stats`);
  return data.data;
}

/** GET /tenants/stats/overview — aggregated stats across all tenants. */
export async function fetchOverviewStats() {
  const { data } = await apiClient.get<
    ApiResponse<TenantStats & { totalTenants: number; activeTenants: number }>
  >("/tenants/stats/overview");
  return data.data;
}
