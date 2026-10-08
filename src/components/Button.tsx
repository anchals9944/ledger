import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { clsx } from "clsx";

/**
 * Button. Figma: Components / Button (Variant × Size × State).
 * primary   = the single filled action on a screen (one per view)
 * secondary = outlined supporting action
 * tertiary  = text-only, low emphasis (Back, Cancel)
 * Height 44 at md, 52 at lg. Focus ring is 2px outside. Loading swaps the icon for a spinner.
 */
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "md" | "lg";
  loading?: boolean;
  iconLeft?: ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-label whitespace-nowrap select-none " +
  "transition-colors outline-none focus-visible:ring-[length:var(--border-width-focus)] focus-visible:ring-focus-ring focus-visible:ring-offset-0 " +
  "disabled:cursor-not-allowed";

const variants = {
  primary: "bg-cta-primary-bg text-cta-primary-text hover:bg-cta-primary-hover disabled:bg-state-disabled-bg disabled:text-state-disabled-text",
  secondary:
    "bg-bg-surface text-cta-secondary-text border border-cta-secondary-border hover:bg-cta-secondary-hover-bg disabled:border-state-disabled-text disabled:text-state-disabled-text",
  tertiary: "bg-transparent text-text-link hover:bg-cta-secondary-hover-bg disabled:text-state-disabled-text",
};

const sizes = {
  md: "h-[length:var(--size-control-md)] px-4",
  lg: "h-[length:var(--size-control-lg)] px-5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, iconLeft, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? "button"}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {loading ? (
        <LoaderCircle aria-hidden className="size-5 animate-spin" strokeWidth={1.5} />
      ) : (
        iconLeft && <span aria-hidden className="size-5 [&>svg]:size-5">{iconLeft}</span>
      )}
      <span>{children}</span>
    </button>
  );
});
