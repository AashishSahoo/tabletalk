import { apiClient } from "@/lib/axios";
import type { ApiResponse, PaginatedData, Review, RatingValue } from "@/types";

interface FetchReviewsParams {
  tenantUuid: string;
  page?: number;
  limit?: number;
  rating?: RatingValue;
}

/** GET /tenants/:tenantUuid/reviews?page=&limit=&rating= */
export async function fetchTenantReviews({ tenantUuid, ...params }: FetchReviewsParams) {
  const { data } = await apiClient.get<ApiResponse<PaginatedData<Review>>>(
    `/tenants/${tenantUuid}/reviews`,
    { params }
  );
  return data.data;
}
