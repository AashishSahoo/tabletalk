export const API_BASE_URL = process.env.NEXT_API_BASE_URL;
//  ?? "http://localhost:5000/api/v1";

export const APP_URL = process.env.NEXT_APP_URL;
// ?? "http://localhost:3000";

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
