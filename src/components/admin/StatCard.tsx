import { Icon } from "@iconify/react";
import clsx from "clsx";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  tone?: "saffron" | "pine" | "clay" | "ink";
}

const TONE_CLASSES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  saffron: "bg-saffron-50 text-saffron-600",
  pine: "bg-pine-50 text-pine-600",
  clay: "bg-clay-500/10 text-clay-600",
  ink: "bg-ink/5 text-ink-soft",
};

export default function StatCard({ label, value, icon, tone = "ink" }: StatCardProps) {
  return (
    <div className="ticket-card flex items-center gap-4 p-5">
      <span
        className={clsx(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          TONE_CLASSES[tone]
        )}
      >
        <Icon icon={icon} width={22} height={22} />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
        <p className="font-display text-2xl text-ink">{value}</p>
      </div>
    </div>
  );
}
