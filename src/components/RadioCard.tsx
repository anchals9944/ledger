import { type InputHTMLAttributes, type ReactNode, useId } from "react";
import { clsx } from "clsx";

/**
 * RadioCard. Figma: Components / Radio card (State: unselected, selected, focus, disabled).
 * One option in a single-choice group, like payment method. The whole card is the hit target.
 * Selected: state/selected/bg + 2px state/selected/border + filled dot. Focus: 2px focus ring.
 */
export type RadioCardProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "title"> & {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
};

export function RadioCard({ title, subtitle, icon, id, className, disabled, checked, ...rest }: RadioCardProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <label
      htmlFor={inputId}
      className={clsx(
        "flex min-h-[length:var(--size-control-md)] cursor-pointer items-center gap-3 rounded-md border px-4 py-3",
        "has-[:focus-visible]:border-[length:var(--border-width-focus)] has-[:focus-visible]:border-border-focus",
        checked ? "border-[length:var(--border-width-focus)] border-state-selected-border bg-state-selected-bg" : "border-border-default bg-bg-surface",
        disabled && "cursor-not-allowed bg-state-disabled-bg",
        className,
      )}
    >
      <input id={inputId} type="radio" className="peer sr-only" disabled={disabled} checked={checked} {...rest} />
      <span
        aria-hidden
        className={clsx(
          "flex size-5 shrink-0 items-center justify-center rounded-full border bg-bg-surface",
          checked ? "border-[length:var(--border-width-focus)] border-state-selected-border" : "border-border-strong",
          disabled && "border-state-disabled-text bg-state-disabled-bg",
        )}
      >
        {checked && <span className="size-2.5 rounded-full bg-cta-primary-bg" />}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={clsx("text-label", disabled ? "text-state-disabled-text" : "text-text-primary")}>{title}</span>
        {subtitle && <span className={clsx("text-caption", disabled ? "text-state-disabled-text" : "text-text-secondary")}>{subtitle}</span>}
      </span>
      {icon && <span aria-hidden className={clsx("size-5 [&>svg]:size-5", disabled ? "text-state-disabled-text" : "text-icon-default")}>{icon}</span>}
    </label>
  );
}
