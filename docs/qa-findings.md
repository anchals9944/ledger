# QA findings

Each finding: what, where, spec vs built, root cause, where the fix went. Newest first.

## F1 · 2026-10-08 · Helper text under 4.5:1 on white

- **Found by:** axe (`color-contrast`) in `tests/e2e/showcase.spec.ts`, desktop and mobile.
- **Where:** `Input` disabled state, helper text `<p class="text-caption text-state-disabled-text">`.
- **Spec vs built:** both used `state/disabled/text` → `neutral/500` `#6F7A86`. On white at 12px that is **4.37:1**; WCAG AA needs 4.5:1. The same primitive feeds `text/placeholder`, `icon/muted` and `border/strong`, so placeholder text was under the line too. The Figma annotation claimed 4.9:1; that number was wrong.
- **Root cause:** token value. Not the component, not the generation. The primitive was chosen by eye and never measured against the surfaces it sits on.
- **Fix, in order:**
  1. Figma: `Primitives / neutral/500` changed to `#5F6B7A` (measured 5.43:1 on white, 5.15:1 on canvas, 4.88:1 on `neutral/100`). Ramp order verified. Description on the variable records why.
  2. Export re-run → `tokens/figma.tokens.json` → `npm run tokens` → `theme.css`.
  3. Code: no component change needed. Added a unit test that asserts the contrast of every `text/*` role against `bg/surface` and `bg/subtle` stays at or above 4.5:1, so this cannot drift back.
  4. Figma annotation corrected to the measured numbers.
- **Lesson for the system:** contrast is a token property. Measure it where the token is defined, and test it where the token is consumed.
