import clsx from "clsx";
import { Icon } from "@iconify/react";
import type { RatingValue } from "@/types";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const toneClasses: Record<string, string> = {
    neutral: "bg-ink/5 text-ink-soft",
    success: "bg-pine-50 text-pine-700",
    warning: "bg-saffron-50 text-saffron-700",
    danger: "bg-clay-500/10 text-clay-600",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  );
}

export function RatingBadge({ rating }: { rating: RatingValue }) {
  const tone = rating >= 4 ? "success" : rating === 3 ? "warning" : "danger";
  return (
    <Badge tone={tone}>
      <Icon icon="mdi:star" width={14} height={14} />
      {rating}
    </Badge>
  );
}
