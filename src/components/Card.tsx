import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

/**
 * Card. Figma: Components / Card (Variant: default, summary).
 * default = white surface with a title and content. summary = subtle background for the order summary,
 * with a divider and a total row. Padding space/5, radius/lg, 1px border/default.
 */
export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "summary";
  title?: string;
  total?: { label: string; value: string };
  children?: ReactNode;
};

export function Card({ variant = "default", title, total, className, children, ...rest }: CardProps) {
  return (
    <section
      className={clsx(
        "flex flex-col gap-4 rounded-lg border border-border-default p-6",
        variant === "summary" ? "bg-bg-subtle" : "bg-bg-surface",
        className,
      )}
      {...rest}
    >
      {title && <h2 className="text-h2 text-text-primary">{title}</h2>}
      {children && <div className="flex flex-col gap-3">{children}</div>}
      {variant === "summary" && total && (
        <>
          <hr className="border-0 border-t border-border-default" />
          <div className="flex items-center justify-between">
            <span className="text-label text-text-primary">{total.label}</span>
            <span className="text-h2 text-text-primary">{total.value}</span>
          </div>
        </>
      )}
    </section>
  );
}
