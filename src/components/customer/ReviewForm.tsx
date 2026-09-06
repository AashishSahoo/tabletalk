"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import type { PublicTenantConfig, RatingValue } from "@/types";
import { fetchTenantByQrId, submitPublicReview } from "@/lib/api/public";
import { handleError } from "@/lib/utils/errorHandler";
import { reviewSubmitSchema } from "@/lib/utils/validators";
import { MAX_COMMENT_LENGTH } from "@/lib/utils/constants";
import { useClipboard } from "@/hooks/useClipboard";
import StarRating from "./StarRating";
import CommentSuggestions from "./CommentSuggestions";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { ReviewCardSkeleton } from "@/components/ui/Skeleton";

type LoadState = "loading" | "ready" | "not_found" | "error";
type Step = "rate" | "comment" | "done";

export default function ReviewForm({ qrId }: { qrId: string }) {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [tenant, setTenant] = useState<PublicTenantConfig | null>(null);

  const [rating, setRating] = useState<RatingValue | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [isCustom, setIsCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<Step>("rate");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const { copy } = useClipboard();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const config = await fetchTenantByQrId(qrId);
        if (!isMounted) return;
        setTenant(config);
        setLoadState("ready");
      } catch (error) {
        if (!isMounted) return;
        const appError = handleError("ReviewForm:fetchTenant", error);
        setLoadState(appError.status === 404 ? "not_found" : "error");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [qrId]);

  const activeSuggestions = useMemo(() => {
    if (!tenant || !rating) return [];
    return tenant.ratingSuggestions.find((g) => g.rating === rating)?.suggestions ?? [];
  }, [tenant, rating]);

  function handleRatingChange(next: RatingValue) {
    setRating(next);
    setSelectedSuggestion(null);
    setIsCustom(false);
    setCustomText("");
    setFieldError(undefined);
    setStep("comment");
  }

  const finalComment = isCustom ? customText.trim() : selectedSuggestion ?? "";

  function redirectToGoogle(url: string) {
    window.setTimeout(() => {
      window.location.href = url;
    }, 1400);
  }

  async function handleSubmit() {
    if (!tenant || !rating) return;

    const parsed = reviewSubmitSchema.safeParse({ rating, comment: finalComment });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Please add a comment before submitting.");
      return;
    }
    setFieldError(undefined);
    setIsSubmitting(true);

    try {
      // If the API request already succeeded but clipboard access was blocked,
      // retry only the copy action. This avoids saving a duplicate review.
      if (redirectUrl) {
        const copied = await copy(finalComment);
        if (!copied) {
          toast.error("We couldn't copy the comment. Select it below and copy it manually.");
          return;
        }
        toast.success("Copied your comment! Taking you to Google Reviews…", { icon: "📋" });
        redirectToGoogle(redirectUrl);
        return;
      }

      const result = await submitPublicReview(qrId, {
        rating,
        comment: parsed.data.comment,
        wasSuggested: !isCustom,
      });

      const copied = await copy(parsed.data.comment);
      setStep("done");
      setRedirectUrl(result.redirectUrl);

      if (!copied) {
        toast.error("We couldn't copy the comment. Select it below and copy it manually.");
        return;
      }

      toast.success("Copied your comment! Taking you to Google Reviews…", { icon: "📋" });
      redirectToGoogle(result.redirectUrl);
    } catch (error) {
      const appError = handleError("ReviewForm:submit", error);
      toast.error(appError.message);
      setIsSubmitting(false);
    }
  }

  if (loadState === "loading") {
    return <ReviewCardSkeleton />;
  }

  if (loadState === "not_found") {
    return (
      <div className="ticket-card w-full max-w-sm p-6">
        <EmptyState
          icon="mdi:qrcode-remove"
          title="This QR code isn't set up yet"
          description="Please ask the restaurant staff to check the code, or try scanning it again."
        />
      </div>
    );
  }

  if (loadState === "error" || !tenant) {
    return (
      <div className="ticket-card w-full max-w-sm p-6">
        <EmptyState
          icon="mdi:wifi-off"
          title="We couldn't load this page"
          description="Check your connection and try scanning the QR code again."
        />
      </div>
    );
  }

  return (
    <div className="ticket-card w-full max-w-sm p-6 pt-8">
      <header className="flex flex-col items-center gap-2 text-center">
        {tenant.logoUrl ? (
          <Image
            src={tenant.logoUrl}
            alt={`${tenant.name} logo`}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full border border-ink/10 object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-saffron-50 text-saffron-600">
            <Icon icon="mdi:silverware-fork-knife" width={28} height={28} />
          </span>
        )}
        <h1 className="font-display text-xl font-medium text-ink">{tenant.name}</h1>
        <p className="text-sm text-ink-muted">How was your visit today?</p>
      </header>

      <div className="mt-6">
        <StarRating value={rating} onChange={handleRatingChange} />
      </div>

      {step !== "rate" && rating && (
        <div className="mt-6 space-y-4">
          <CommentSuggestions
            suggestions={activeSuggestions}
            selected={selectedSuggestion}
            isCustom={isCustom}
            onSelect={(text) => {
              setSelectedSuggestion(text);
              setIsCustom(false);
              setFieldError(undefined);
            }}
            onWriteOwn={() => {
              setIsCustom(true);
              setSelectedSuggestion(null);
              setFieldError(undefined);
            }}
          />

          {isCustom && (
            <TextArea
              autoFocus
              rows={3}
              maxLength={MAX_COMMENT_LENGTH}
              placeholder="Tell us about your experience…"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              error={fieldError}
            />
          )}
          {!isCustom && fieldError ? (
            <p className="text-xs text-clay-600">{fieldError}</p>
          ) : null}

          <Button
            fullWidth
            size="lg"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            <Icon icon="mdi:content-copy" width={18} height={18} />
            Copy & Continue to Google
          </Button>
          {step === "done" && redirectUrl && (
            <div className="rounded-ticket border border-saffron-300 bg-saffron-50 p-3">
              <p className="mb-1 text-xs font-medium text-ink">Your review was saved</p>
              <p className="text-xs text-ink-muted">
                If copying is blocked, select this text, copy it manually, then continue to Google.
              </p>
              <textarea
                readOnly
                value={finalComment}
                aria-label="Your review comment"
                onFocus={(event) => event.currentTarget.select()}
                className="mt-2 w-full resize-none rounded border border-ink/15 bg-white p-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-saffron-500/60"
                rows={2}
              />
              <a
                href={redirectUrl}
                className="mt-2 inline-flex text-xs font-medium text-saffron-700 underline underline-offset-2"
              >
                Continue to Google Reviews
              </a>
            </div>
          )}
          <p className="text-center text-xs text-ink-muted">
            We&apos;ll copy your comment so you can paste it straight into Google Reviews.
          </p>
        </div>
      )}
    </div>
  );
}
