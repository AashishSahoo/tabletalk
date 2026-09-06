import { z } from "zod";
import { MAX_COMMENT_LENGTH, MAX_SUGGESTIONS_PER_RATING } from "./constants";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const ratingSuggestionGroupSchema = z.object({
  rating: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  suggestions: z
    .array(z.string().trim().min(1, "Suggestion can't be empty").max(140))
    .min(1, "Add at least one suggestion for each rating")
    .max(MAX_SUGGESTIONS_PER_RATING, `Max ${MAX_SUGGESTIONS_PER_RATING} suggestions per rating`),
});

export const tenantFormSchema = z.object({
  name: z.string().trim().min(2, "Restaurant name is required"),
  ownerName: z.string().trim().max(100, "Keep the name under 100 characters").optional(),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().trim().optional().or(z.literal("")),
  whatsappNumber: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || /^\+?[1-9]\d{7,14}$/.test(val),
      "Use international format, e.g. +919876543210"
    ),
  googleReviewUrl: z
    .string()
    .trim()
    .min(1, "Google review URL is required")
    .url("Enter a valid URL"),
  logoUrl: z.string().trim().url("Enter a valid logo URL").optional(),
  ratingSuggestions: z.array(ratingSuggestionGroupSchema).length(5),
});

export const reviewSubmitSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z
    .string()
    .trim()
    .min(1, "Please add a short comment before submitting")
    .max(MAX_COMMENT_LENGTH, `Keep it under ${MAX_COMMENT_LENGTH} characters`),
});

export type TenantFormValues = z.infer<typeof tenantFormSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
