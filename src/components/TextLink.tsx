import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

/**
 * TextLink. Figma: Components / Text link (State: default, hover, focus).
 * An inline text action that sits inside a sentence, like "Change" after a summary line.
 * Added as finding F2: the frame needed an inline action and Button tertiary is 44px with padding.
 * Still a button (it does something on this page), not an anchor. Focus ring from focus/ring.
 */
export function TextLink({ className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={clsx(
        "inline rounded-sm text-label text-text-link underline-offset-2 outline-none hover:underline",
        "focus-visible:ring-[length:var(--border-width-focus)] focus-visible:ring-focus-ring",
        "disabled:text-state-disabled-text disabled:no-underline",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
