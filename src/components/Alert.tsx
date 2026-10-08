import type { HTMLAttributes } from "react";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { clsx } from "clsx";

/**
 * Alert. Figma: Components / Alert (Variant: error, success, info).
 * Says what happened and what to do next. Error must say whether a charge was made.
 * Never the only place an error is shown: pair with field-level errors.
 */
export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant: "error" | "success" | "info";
  title: string;
  body?: string;
  action?: { label: string; onClick: () => void };
  onClose?: () => void;
};

const styles = {
  error: { box: "bg-state-error-bg border-state-error-border", fg: "text-state-error-text", Icon: CircleAlert, role: "alert" as const },
  success: { box: "bg-state-success-bg border-state-success-border", fg: "text-state-success-text", Icon: CircleCheck, role: "status" as const },
  info: { box: "bg-bg-subtle border-border-default", fg: "text-text-primary", Icon: Info, role: "status" as const },
};

export function Alert({ variant, title, body, action, onClose, className, ...rest }: AlertProps) {
  const s = styles[variant];
  return (
    <div role={s.role} className={clsx("flex items-start gap-3 rounded-md border p-4", s.box, className)} {...rest}>
      <s.Icon aria-hidden className={clsx("size-5 shrink-0", s.fg)} strokeWidth={1.5} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className={clsx("text-label", s.fg)}>{title}</p>
        {body && <p className={clsx("text-body-sm", variant === "info" ? "text-text-secondary" : s.fg)}>{body}</p>}
        {action && (
          <button type="button" onClick={action.onClick} className="self-start text-label text-text-link outline-none hover:underline focus-visible:underline">
            {action.label}
          </button>
        )}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss" className="flex size-11 -m-3 shrink-0 items-center justify-center rounded-md text-icon-muted outline-none hover:text-icon-default focus-visible:ring-[length:var(--border-width-focus)] focus-visible:ring-focus-ring">
          <X aria-hidden className="size-5" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
