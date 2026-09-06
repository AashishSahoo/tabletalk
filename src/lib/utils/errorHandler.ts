import axios from "axios";
import type { AppError } from "@/types";

const GENERIC_MESSAGE = "Something went wrong. Please try again in a moment.";
const OFFLINE_MESSAGE =
  "We can't reach the server right now. Check your internet connection and try again.";

/**
 * Converts ANY thrown error (axios error, JS error, unknown) into a single
 * user-safe AppError. Raw error messages / stack traces are NEVER surfaced
 * to the UI — they are only sent to logError(), which is the one place
 * allowed to touch console/telemetry.
 */
export function toAppError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return { message: OFFLINE_MESSAGE };
    }

    const status = error.response.status;
    const body = error.response.data as
      | { message?: string; errors?: Record<string, string> }
      | undefined;

    const fieldErrors = body?.errors;
    const serverMessage =
      typeof body?.message === "string" ? body.message : undefined;

    switch (status) {
      case 400:
      case 422:
        return {
          message: serverMessage ?? "Please check the details you entered.",
          status,
          fieldErrors,
        };
      case 401:
        return { message: "Your session has expired. Please log in again.", status };
      case 403:
        return { message: "You don't have permission to do that.", status };
      case 404:
        return { message: "We couldn't find what you were looking for.", status };
      case 409:
        return { message: serverMessage ?? "That already exists.", status };
      case 429:
        return { message: "Too many attempts. Please wait a moment and try again.", status };
      case 500:
      case 502:
      case 503:
      case 504:
        return { message: "Our server hit a snag. Please try again shortly.", status };
      default:
        return { message: GENERIC_MESSAGE, status };
    }
  }

  return { message: GENERIC_MESSAGE };
}

/**
 * Single place responsible for logging real error detail (dev console now;
 * swap the body for Sentry/LogRocket/your logging endpoint in production).
 * UI code should never console.log raw errors directly.
 */
export function logError(context: string, error: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(`[${context}]`, error);
  }
  // TODO(production): ship to a real logging/monitoring backend, e.g.
  // fetch('/api/client-logs', { method: 'POST', body: JSON.stringify({ context, error }) })
}

/** Convenience: log + normalize in one call, used by most catch blocks. */
export function handleError(context: string, error: unknown): AppError {
  logError(context, error);
  return toAppError(error);
}
