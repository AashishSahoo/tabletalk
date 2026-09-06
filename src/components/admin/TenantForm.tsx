"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import type { RatingSuggestionGroup, RatingValue, Tenant, TenantFormInput } from "@/types";
import { tenantFormSchema } from "@/lib/utils/validators";
import { MAX_SUGGESTIONS_PER_RATING } from "@/lib/utils/constants";
import { handleError } from "@/lib/utils/errorHandler";
import { createTenant, updateTenant } from "@/lib/api/tenant";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const RATINGS: RatingValue[] = [1, 2, 3, 4, 5];

function emptySuggestionGroups(): RatingSuggestionGroup[] {
  return RATINGS.map((rating) => ({ rating, suggestions: [""] }));
}

interface TenantFormProps {
  tenant?: Tenant | null;
  onSaved: (tenant: Tenant) => void;
  onCancel?: () => void;
}

export default function TenantForm({ tenant, onSaved, onCancel }: TenantFormProps) {
  const isEdit = Boolean(tenant);

  const [name, setName] = useState(tenant?.name ?? "");
  const [ownerName, setOwnerName] = useState(tenant?.contact.ownerName ?? "");
  const [email, setEmail] = useState(tenant?.contact.email ?? "");
  const [phone, setPhone] = useState(tenant?.contact.phone ?? "");
  const [whatsappNumber, setWhatsappNumber] = useState(tenant?.contact.whatsappNumber ?? "");
  const [googleReviewUrl, setGoogleReviewUrl] = useState(tenant?.googleReviewUrl ?? "");
  const [logoUrl, setLogoUrl] = useState(tenant?.logoUrl ?? "");
  const [groups, setGroups] = useState<RatingSuggestionGroup[]>(
    tenant?.ratingSuggestions?.length ? tenant.ratingSuggestions : emptySuggestionGroups()
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  function updateSuggestion(rating: RatingValue, index: number, value: string) {
    setGroups((prev) =>
      prev.map((g) =>
        g.rating === rating
          ? { ...g, suggestions: g.suggestions.map((s, i) => (i === index ? value : s)) }
          : g
      )
    );
  }

  function addSuggestion(rating: RatingValue) {
    setGroups((prev) =>
      prev.map((g) =>
        g.rating === rating && g.suggestions.length < MAX_SUGGESTIONS_PER_RATING
          ? { ...g, suggestions: [...g.suggestions, ""] }
          : g
      )
    );
  }

  function removeSuggestion(rating: RatingValue, index: number) {
    setGroups((prev) =>
      prev.map((g) =>
        g.rating === rating
          ? { ...g, suggestions: g.suggestions.filter((_, i) => i !== index) }
          : g
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: TenantFormInput = {
      name: name.trim(),
      ownerName: ownerName.trim() || undefined,
      email: email.trim(),
      phone: phone.trim() || undefined,
      whatsappNumber: whatsappNumber.trim() || undefined,
      googleReviewUrl: googleReviewUrl.trim(),
      logoUrl: logoUrl.trim() || undefined,
      ratingSuggestions: groups.map((g) => ({
        rating: g.rating,
        suggestions: g.suggestions.map((s) => s.trim()).filter(Boolean),
      })),
    };

    const parsed = tenantFormSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setFieldErrors({});
    setIsSaving(true);

    try {
      const saved =
        isEdit && tenant ? await updateTenant(tenant.uuid, payload) : await createTenant(payload);
      toast.success(isEdit ? "Restaurant updated" : "Restaurant created");
      onSaved(saved);
    } catch (error) {
      const appError = handleError("TenantForm:submit", error);
      toast.error(appError.message);
      if (appError.fieldErrors) setFieldErrors(appError.fieldErrors);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Restaurant name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
          placeholder="The Copper Spoon"
        />
        <Input
          label="Owner / manager name (optional)"
          name="ownerName"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          error={fieldErrors.ownerName}
          placeholder="Priya Sharma"
        />
        <Input
          label="Owner / manager email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          placeholder="owner@restaurant.com"
        />
        <Input
          label="Phone (optional)"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={fieldErrors.phone}
          placeholder="+91 98765 43210"
        />
        <Input
          label="WhatsApp number (for QR sharing)"
          name="whatsappNumber"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          error={fieldErrors.whatsappNumber}
          placeholder="+919876543210"
          hint="Include country code. Leave blank to disable WhatsApp sharing."
        />
        <Input
          label="Google review link"
          name="googleReviewUrl"
          className="sm:col-span-2"
          value={googleReviewUrl}
          onChange={(e) => setGoogleReviewUrl(e.target.value)}
          error={fieldErrors.googleReviewUrl}
          placeholder="https://g.page/r/xxxxxxxxxxxx/review"
        />
        <Input
          label="Restaurant logo URL (optional)"
          name="logoUrl"
          className="sm:col-span-2"
          type="url"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          error={fieldErrors.logoUrl}
          placeholder="https://example.com/restaurant-logo.png"
          hint="Shown on the customer feedback page."
        />
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-ink-soft">Suggested comments by rating</p>
        <p className="mb-3 text-xs text-ink-muted">
          Up to {MAX_SUGGESTIONS_PER_RATING} quick suggestions shown when a customer picks each
          star rating.
        </p>
        {fieldErrors.ratingSuggestions ? (
          <p className="mb-3 text-xs text-clay-600">{fieldErrors.ratingSuggestions}</p>
        ) : null}
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.rating} className="rounded-ticket border border-ink/10 p-3.5">
              <div className="mb-2 flex items-center gap-1 text-sm font-medium text-ink">
                {Array.from({ length: group.rating }).map((_, i) => (
                  <Icon key={i} icon="mdi:star" width={16} height={16} className="text-saffron-500" />
                ))}
                <span className="ml-1 text-ink-muted">({group.rating} star)</span>
              </div>
              <div className="space-y-2">
                {group.suggestions.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={s}
                      onChange={(e) => updateSuggestion(group.rating, i, e.target.value)}
                      placeholder={`Suggestion ${i + 1}`}
                      className="w-full rounded-ticket border border-ink/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500/60"
                    />
                    <button
                      type="button"
                      onClick={() => removeSuggestion(group.rating, i)}
                      aria-label="Remove suggestion"
                      className="rounded-full p-1.5 text-ink-muted hover:bg-ink/5 hover:text-clay-600"
                    >
                      <Icon icon="mdi:trash-can-outline" width={16} height={16} />
                    </button>
                  </div>
                ))}
                {group.suggestions.length < MAX_SUGGESTIONS_PER_RATING && (
                  <button
                    type="button"
                    onClick={() => addSuggestion(group.rating)}
                    className="flex items-center gap-1 text-xs font-medium text-saffron-700 hover:text-saffron-600"
                  >
                    <Icon icon="mdi:plus" width={14} height={14} />
                    Add suggestion
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSaving}>
          {isEdit ? "Save changes" : "Create restaurant"}
        </Button>
      </div>
    </form>
  );
}
