import clsx from "clsx";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const SIZE_MAP: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export default function Spinner({ size = "md", className, label }: SpinnerProps) {
  return (
    <span className="inline-flex items-center gap-2" role="status" aria-live="polite">
      <span
        className={clsx(
          "animate-spin rounded-full border-current border-t-transparent",
          SIZE_MAP[size],
          className
        )}
      />
      {label ? <span className="text-sm text-ink-muted">{label}</span> : null}
      <span className="sr-only">Loading</span>
    </span>
  );
}
