// Requests stay same-origin. next.config.js proxies this path to the backend,
// which owns the API version.
export const API_BASE_URL = "/api";

export const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

export const ADMIN_TOKEN_KEY = "admin_token";

export const MAX_COMMENT_LENGTH = 500;

export const MAX_SUGGESTIONS_PER_RATING = 5;

export const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Excellent",
};

export function buildQrDestination(qrId: string): string {
  return `${APP_URL}/r/${qrId}`;
}

export function buildWhatsAppShareLink(phone: string, message: string): string {
  const digitsOnly = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}
