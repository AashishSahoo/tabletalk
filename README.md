# TableTalk — Frontend (Next.js)

QR-code restaurant feedback funnel: a customer scans a table QR, rates 1-5
stars, picks (or writes) a comment, the comment is copied to their
clipboard, and they land on the restaurant's Google review page ready to
paste. Restaurant owners manage everything — rating-based comment
suggestions, the Google review link, and QR codes — from an admin console.

**This repo is the frontend only.** It is built against a REST API
contract (below) that a separate Express + TypeScript + MongoDB backend
repo should implement. Nothing here assumes a specific backend
implementation, only the JSON shapes documented below.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (custom "ticket" design system — see `DESIGN.md`)
- Redux Toolkit (`auth`, `ui`, `tenant` slices) for admin state
- Axios (single instance with interceptors — see `src/lib/axios.ts`)
- Iconify (`@iconify/react`, Material Design Icons set)
- react-hot-toast for all user-facing notifications
- Chart.js / react-chartjs-2 for the admin dashboard
- qrcode.react for client-side QR generation
- zod for form/schema validation

## Getting started

```bash
npm install
cp .env.example .env.local   # point NEXT_PUBLIC_API_BASE_URL at your backend
npm run dev
```

Visit `http://localhost:3000` for the landing page, or
`http://localhost:3000/r/<qrId>` to preview the customer flow once your
backend has a matching QR record.

## Project structure

```
src/
  app/
    page.tsx                          # landing page -> links to admin login
    r/[qrId]/page.tsx                 # customer feedback flow (public)
    admin/
      login/page.tsx
      layout.tsx                      # sidebar/topbar shell + auth guard
      dashboard/page.tsx              # overview stats + charts
      restaurants/page.tsx            # tenant list, create modal
      restaurants/[id]/page.tsx       # tenant settings (edit)
      restaurants/[id]/reviews/page.tsx
      restaurants/[id]/qr/page.tsx
  components/
    ui/         # Button, Input, TextArea, Modal, Skeleton, Spinner, Badge...
    customer/   # StarRating, CommentSuggestions, ReviewForm
    admin/      # Sidebar, Topbar, TenantForm, QRCodeCard, ReviewsTable, charts
    providers/  # Redux + Toaster wrapper
  store/        # Redux Toolkit store + slices
  lib/
    axios.ts        # shared axios instance, interceptors
    api/            # one file per API resource (public, auth, tenant, review)
    utils/          # errorHandler, constants, validators
  hooks/        # useClipboard, useTenant
  types/        # shared TS types mirroring the API contract below
```

## Error handling & UX conventions

- **Every** API error is passed through `handleError()` /
  `toAppError()` (`src/lib/utils/errorHandler.ts`), which maps HTTP status
  codes to short, generic, user-safe copy. Raw error objects/stack traces
  are only ever sent to `logError()` (console in dev; wire this to
  Sentry/your logging endpoint for production) — they never reach a toast
  or the UI.
- All async actions show a **loading state**: skeleton loaders
  (`components/ui/Skeleton.tsx`) for content that's shaped like the final
  UI, and a circular `Spinner` inside buttons for in-flight submissions.
- All success/error feedback goes through `react-hot-toast`
  (`components/providers/AppProviders.tsx` configures the single
  `<Toaster />` for the whole app).
- The admin shell is mobile-first: the sidebar is an off-canvas drawer
  below `lg`, and every table/grid collapses to single-column on small
  screens.

## Backend API contract

All endpoints are prefixed with `NEXT_PUBLIC_API_BASE_URL`
(e.g. `http://localhost:5000/api/v1`). Every response follows the same
envelope:

```ts
{ success: boolean; message?: string; data: T }
```

Paginated list endpoints return `data` shaped as:

```ts
{ items: T[]; page: number; limit: number; total: number; totalPages: number }
```

Validation errors should return HTTP 422 with:

```ts
{ success: false, message: string, errors: { [field: string]: string } }
```

### Public (no auth) - customer flow

| Method | Path | Description |
|---|---|---|
| GET | `/public/qr/:qrId` | Resolve a scanned QR to `PublicTenantConfig` (name, logo, 5x5 rating-suggestion matrix). 404 if the QR is unknown/inactive. |
| POST | `/public/qr/:qrId/reviews` | Body: `{ rating: 1-5, comment: string, wasSuggested: boolean }`. Saves the review, returns `{ redirectUrl, uuid }` where `redirectUrl` is the tenant's stored Google review link. |

### Auth (admin)

| Method | Path | Description |
|---|---|---|
| POST | `/auth/login` | Body: `{ email, password }` -> `{ token, user }`. |
| GET | `/auth/me` | Bearer token required -> current `AdminUser`. Used to rehydrate sessions on refresh. |
| POST | `/auth/logout` | Invalidate the current session server-side (best effort). |

### Tenants (admin, bearer token required)

| Method | Path | Description |
|---|---|---|
| GET | `/tenants?page=&limit=&search=` | Paginated tenant list. |
| POST | `/tenants` | Create a tenant. Body: `TenantFormInput` (see below). Server should generate `qrId` and `slug`. |
| GET | `/tenants/:uuid` | Single tenant, full record. |
| PUT | `/tenants/:uuid` | Update a tenant. Same body shape as create. |
| DELETE | `/tenants/:uuid` | Remove a tenant (reviews should be retained/archived, not cascade-deleted). |
| GET | `/tenants/:uuid/stats` | `TenantStats` for one tenant (used on the Reviews tab and could back per-tenant dashboards). |
| GET | `/tenants/stats/overview` | `TenantStats & { totalTenants, activeTenants }` aggregated across all tenants -- powers `/admin/dashboard`. |
| GET | `/tenants/:tenantUuid/reviews?page=&limit=&rating=` | Paginated reviews for one tenant, optional `rating` filter (1-5). |

### Core shapes (see `src/types/index.ts` for the authoritative TS versions)

```ts
type RatingValue = 1 | 2 | 3 | 4 | 5;

interface RatingSuggestionGroup {
  rating: RatingValue;
  suggestions: string[]; // up to 5 short strings
}

interface Tenant {
  uuid: string;
  name: string;
  slug: string;
  qrId: string;              // opaque id used in /r/:qrId
  logoUrl?: string;
  googleReviewUrl: string;
  contact: {
    ownerName?: string;
    email: string;
    phone?: string;
    whatsappNumber?: string; // E.164, e.g. +919876543210
  };
  ratingSuggestions: RatingSuggestionGroup[]; // exactly 5 groups, ratings 1-5
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PublicTenantConfig {
  tenantUuid: string;
  qrId: string;
  name: string;
  logoUrl?: string;
  ratingSuggestions: RatingSuggestionGroup[];
}

interface Review {
  uuid: string;
  tenantUuid: string;
  rating: RatingValue;
  comment: string;
  wasSuggested: boolean;      // true if a canned suggestion was used as-is
  redirectedToGoogle: boolean;
  createdAt: string;
}

interface TenantStats {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: Record<RatingValue, number>;
  reviewsLast7Days: { date: string; count: number }[];
}

interface AdminUser {
  uuid: string;
  name: string;
  email: string;
  role: "super_admin" | "manager";
}
```

### Suggested backend middleware (Express + TS)

To match this frontend's expectations 1:1, the backend should include:

- `helmet`, `cors` (scoped to the frontend's origin), `express.json()`
- A request logger (`morgan` or `pino-http`) writing structured logs, kept
  separate from any user-facing error messages
- A single centralized error-handling middleware that always responds with
  the `{ success: false, message, errors? }` envelope above and logs the
  real stack trace server-side only
- JWT auth middleware protecting every `/tenants*` route; `/public/*`
  stays unauthenticated but should be rate-limited (`express-rate-limit`)
  since it's open to anyone who scans a QR
- Mongoose schemas for `Tenant` and `Review`, with `qrId` and `slug`
  unique-indexed on `Tenant`
- A validation layer (`zod` or `joi`) mirroring `src/lib/utils/validators.ts`
  on the frontend, so both sides agree on what "valid" means
