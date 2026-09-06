"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import type { RatingValue } from "@/types";
import { RATING_LABELS } from "@/lib/utils/constants";

interface StarRatingProps {
  value: RatingValue | null;
  onChange: (rating: RatingValue) => void;
}

export default function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState<RatingValue | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex items-center gap-1 sm:gap-2"
        role="radiogroup"
        aria-label="Rate your experience from 1 to 5 stars"
        onMouseLeave={() => setHovered(null)}
      >
        {([1, 2, 3, 4, 5] as RatingValue[]).map((star) => {
          const filled = display !== null && star <= display;
          const justSelected = value === star;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} star${star > 1 ? "s" : ""} — ${RATING_LABELS[star]}`}
              onMouseEnter={() => setHovered(star)}
              onFocus={() => setHovered(star)}
              onBlur={() => setHovered(null)}
              onClick={() => onChange(star)}
              className={clsx(
                "rounded-full p-1 transition-transform duration-150 hover:scale-110 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2"
              )}
            >
              <Icon
                icon={filled ? "mdi:star" : "mdi:star-outline"}
                width={38}
                height={38}
                className={clsx(
                  "transition-colors duration-150",
                  filled ? "text-saffron-500" : "text-ink/25",
                  justSelected && "animate-pop-in"
                )}
              />
            </button>
          );
        })}
      </div>
      <p className="h-5 text-sm font-medium text-ink-soft" aria-live="polite">
        {display ? RATING_LABELS[display] : "Tap a star to rate us"}
      </p>
    </div>
  );
}
