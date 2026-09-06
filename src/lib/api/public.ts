import { apiClient } from "@/lib/axios";
import type {
  ApiResponse,
  PublicTenantConfig,
  ReviewSubmitPayload,
  ReviewSubmitResult,
} from "@/types";

/**
 * GET /public/qr/:qrId
 * Resolves a scanned QR code to the tenant's public-safe config
 * (name, logo, and the 5x5 rating-suggestion matrix).
 */
export async function fetchTenantByQrId(qrId: string) {
  const { data } = await apiClient.get<ApiResponse<PublicTenantConfig>>(
    `/public/qr/${encodeURIComponent(qrId)}`
  );
  return data.data;
}

/**
 * POST /public/qr/:qrId/reviews
 * Saves the customer's feedback and returns the Google review URL to
 * redirect to next.
 */
export async function submitPublicReview(qrId: string, payload: ReviewSubmitPayload) {
  const { data } = await apiClient.post<ApiResponse<ReviewSubmitResult>>(
    `/public/qr/${encodeURIComponent(qrId)}/reviews`,
    payload
  );
  return data.data;
}
