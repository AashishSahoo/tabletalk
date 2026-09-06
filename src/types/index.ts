// ---------------------------------------------------------------------------
// Shared domain types. These mirror the API contract documented in
// README.md → "Backend API contract" and should stay in sync with the
// backend repo's response shapes.
// ---------------------------------------------------------------------------

export type RatingValue = 1 | 2 | 3 | 4 | 5;

/** Generic API envelope every endpoint responds with. */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedData<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** One rating level (1-5) and the canned suggestions admin configured for it. */
export interface RatingSuggestionGroup {
  rating: RatingValue;
  suggestions: string[]; // up to 5 short comment suggestions
}

export interface TenantContact {
  ownerName?: string;
  email: string;
  phone?: string;
  whatsappNumber?: string; // E.164 format, e.g. +919876543210
}

export interface Tenant {
  uuid: string;
  name: string;
  slug: string;
  qrId: string;
  logoUrl?: string;
  googleReviewUrl: string;
  contact: TenantContact;
  ratingSuggestions: RatingSuggestionGroup[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TenantFormInput = Pick<
  Tenant,
  "name" | "googleReviewUrl" | "ratingSuggestions"
> & {
  ownerName?: string;
  email: string;
  phone?: string;
  whatsappNumber?: string;
  logoUrl?: string;
};

/** Minimal public-safe projection returned to the customer-facing /r/[qrId] page. */
export interface PublicTenantConfig {
  tenantUuid: string;
  qrId: string;
  name: string;
  logoUrl?: string;
  ratingSuggestions: RatingSuggestionGroup[];
}

export interface Review {
  uuid: string;
  tenantUuid: string;
  rating: RatingValue;
  comment: string;
  wasSuggested: boolean; // true if a canned suggestion was used as-is
  redirectedToGoogle: boolean;
  createdAt: string;
}

export interface ReviewSubmitPayload {
  rating: RatingValue;
  comment: string;
  wasSuggested: boolean;
}

export interface ReviewSubmitResult {
  redirectUrl: string;
  uuid: string;
}

export interface TenantStats {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: Record<RatingValue, number>;
  reviewsLast7Days: { date: string; count: number }[];
}

export interface AdminUser {
  uuid: string;
  name: string;
  email: string;
  role: "super_admin" | "manager";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: AdminUser;
}

/** Normalized shape our error handler always produces — never a raw Error. */
export interface AppError {
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
}
