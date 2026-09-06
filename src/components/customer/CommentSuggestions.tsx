"use client";

import clsx from "clsx";
import { Icon } from "@iconify/react";

interface CommentSuggestionsProps {
  suggestions: string[];
  selected: string | null;
  isCustom: boolean;
  onSelect: (text: string) => void;
  onWriteOwn: () => void;
}

export default function CommentSuggestions({
  suggestions,
  selected,
  isCustom,
  onSelect,
  onWriteOwn,
}: CommentSuggestionsProps) {
  return (
    <div className="w-full animate-rise-in">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">
        Pick what fits, or write your own
      </p>
      <div className="flex flex-col gap-2">
        {suggestions.map((text) => {
          const active = !isCustom && selected === text;
          return (
            <button
              key={text}
              type="button"
              onClick={() => onSelect(text)}
              className={clsx(
                "flex items-start gap-2 rounded-ticket border px-3.5 py-2.5 text-left text-sm transition-colors",
                active
                  ? "border-saffron-500 bg-saffron-50 text-ink"
                  : "border-ink/12 bg-white text-ink-soft hover:border-ink/25"
              )}
            >
              <Icon
                icon={active ? "mdi:check-circle" : "mdi:circle-outline"}
                width={18}
                height={18}
                className={clsx("mt-0.5 shrink-0", active ? "text-saffron-600" : "text-ink/25")}
              />
              <span>{text}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={onWriteOwn}
          className={clsx(
            "flex items-center gap-2 rounded-ticket border px-3.5 py-2.5 text-left text-sm transition-colors",
            isCustom
              ? "border-saffron-500 bg-saffron-50 text-ink"
              : "border-dashed border-ink/20 text-ink-muted hover:border-ink/35"
          )}
        >
          <Icon icon="mdi:pencil-outline" width={18} height={18} className="shrink-0" />
          Write my own comment
        </button>
      </div>
    </div>
  );
}
