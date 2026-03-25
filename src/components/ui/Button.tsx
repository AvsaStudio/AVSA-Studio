import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[var(--charcoal)] text-white hover:bg-stone-700 disabled:bg-stone-300",
  secondary:
    "border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-50",
  ghost:
    "text-stone-600 hover:bg-stone-100 disabled:opacity-50",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-4 text-xs",
  md: "h-10 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
            Loading…
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
