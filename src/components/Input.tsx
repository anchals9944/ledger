import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { CircleAlert } from "lucide-react";
import { clsx } from "clsx";

/**
 * Input. Figma: Components / Input (State: default, focus, filled, error, disabled).
 * Label above, helper or error text below. Error text replaces the helper and says how to fix it.
 * Height 44. Error border is state/error/border; focus border is border/focus at 2px.
 */
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string;
  helperText?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, error, id, className, disabled, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const message = error ?? helperText;

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <label htmlFor={inputId} className={clsx("text-label", disabled ? "text-state-disabled-text" : "text-text-primary")}>
        {label}
      </label>
      <div
        className={clsx(
          "flex h-[length:var(--size-control-md)] items-center gap-2 rounded-md border bg-bg-surface px-3",
          "focus-within:border-[length:var(--border-width-focus)] focus-within:border-border-focus",
          error ? "border-state-error-border" : "border-border-default",
          disabled && "bg-state-disabled-bg",
        )}
      >
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={clsx(
            "min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-text-placeholder",
            disabled ? "text-state-disabled-text" : "text-text-primary",
          )}
          {...rest}
        />
        {error && <CircleAlert aria-hidden className="size-5 shrink-0 text-state-error-text" strokeWidth={1.5} />}
      </div>
      {message && (
        <p
          id={messageId}
          role={error ? "alert" : undefined}
          className={clsx("text-caption", error ? "text-state-error-text" : disabled ? "text-state-disabled-text" : "text-text-secondary")}
        >
          {message}
        </p>
      )}
    </div>
  );
});
