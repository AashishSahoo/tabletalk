import { forwardRef, type TextareaHTMLAttributes } from "react";
import clsx from "clsx";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, maxLength, id, className, value, ...rest },
  ref
) {
  const areaId = id ?? rest.name;
  const currentLength = typeof value === "string" ? value.length : 0;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={areaId} className="mb-1.5 block text-sm font-medium text-ink-soft">
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={areaId}
        value={value}
        maxLength={maxLength}
        className={clsx(
          "w-full resize-none rounded-ticket border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/70",
          "focus:outline-none focus:ring-2 focus:ring-saffron-500/60",
          error ? "border-clay-500" : "border-ink/15",
          className
        )}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      <div className="mt-1 flex items-center justify-between">
        {error ? (
          <p className="text-xs text-clay-600">{error}</p>
        ) : (
          <span aria-hidden="true" />
        )}
        {maxLength ? (
          <span className="text-xs text-ink-muted">
            {currentLength}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  );
});

export default TextArea;
