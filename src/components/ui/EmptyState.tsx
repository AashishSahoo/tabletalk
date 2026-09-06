import { Icon } from "@iconify/react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon = "mdi:receipt-text-outline",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-ticket border border-dashed border-ink/15 bg-white/60 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-saffron-50 text-saffron-600">
        <Icon icon={icon} width={26} height={26} />
      </span>
      <p className="font-display text-base text-ink">{title}</p>
      {description ? <p className="max-w-xs text-sm text-ink-muted">{description}</p> : null}
      {action}
    </div>
  );
}
