"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import Spinner from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-espresso text-ivory hover:bg-espresso-light active:bg-espresso-dark disabled:bg-ink/30",
  secondary: "bg-saffron-500 text-espresso hover:bg-saffron-600 disabled:bg-saffron-100",
  ghost: "bg-transparent text-ink hover:bg-ink/5 disabled:text-ink/30",
  outline: "bg-transparent border border-ink/20 text-ink hover:bg-ink/5 disabled:text-ink/30",
  danger: "bg-clay-500 text-ivory hover:bg-clay-600 disabled:bg-clay-500/40",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-base px-5 py-3 gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    isLoading = false,
    fullWidth = false,
    disabled,
    className,
    children,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={clsx(
        "inline-flex items-center justify-center rounded-ticket font-medium transition-colors duration-150",
        "focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
        "disabled:cursor-not-allowed",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {isLoading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  );
});

export default Button;
