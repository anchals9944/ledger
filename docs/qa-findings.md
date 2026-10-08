# QA findings

Each finding: what, where, spec vs built, root cause, where the fix went. Newest first.

## F6 · 2026-10-08 · Spacing utilities resolved to nothing, silently

- **Found by:** side-by-side visual QA of the Playwright screenshots against the Figma frames (`docs/qa-checklist.md` rows 7, 10, 24). Three symptoms: the selected radio card had no inner dot, Apply sat 20px below the Code field, the Lock icon in Pay rendered at 24px where the frame says 20.
- **What happened:** the generated theme named the spacing tokens `--spacing-1 … --spacing-8` (4 … 64px, the Figma steps) and reset Tailwind's base `--spacing`. Named steps work for `gap-3` or `p-5`, but any multiple outside the list (`size-2.5`, `size-5`, `mt-7`, `size-11`) is computed from the base and came out empty. No error, no class, no pixel. The token guardrail only looks for raw values, so it saw nothing wrong.
- **Spec vs built:** Figma radio dot 10px, built 0. Figma Apply aligned with the field, built 48px down (`mt-7` was meant as 28). Figma icon 20px, built 24 (the SVG's own size won).
- **Root cause:** token architecture, at the Figma-to-Tailwind boundary. Figma names steps by index (`space/5` = 24px); Tailwind names them by multiple (`p-6` = 24px). Two numbering systems for one scale, and the generated theme picked the wrong one.
- **Fix, in order:**
  1. Figma: spacing variables renamed by pixel value, `space/4 … space/64`, so the name is the value. Code syntax on each reads `p-6 · gap-6 · m-6 (24px)`.
  2. Export re-run, Style Dictionary now emits one line, `--spacing: 4px`, so every numeric utility is px/4 and nothing resolves to nothing.
  3. Guardrail: a new rule fails any spacing utility whose multiple is not a Figma step (allowed 1 2 3 4 6 8 12 16). `p-5` and `mt-7` are now errors, which is what the design system meant all along.
  4. `CLAUDE.md` rule 1a states the mapping. Code: `p-5` → `p-6` in Card, `px-5` → `px-6` in Button lg, the Apply alignment uses a label-height spacer.
- **Lesson:** a class that compiles to nothing is worse than a raw value, because nobody sees it. Make the base scale explicit and lint the multiples against the design steps.

## F5 · 2026-10-08 · An error message appearing moved the Pay button mid-tap (mobile)

- **Found by:** Playwright, mobile project. The `validation errors` test kept failing after F4. A debug run showed `aria-invalid` count 1 after the tap, so submit never ran.
- **What happened:** on 390 the Pay button sits below the form. Tapping it blurs Expiry, Expiry's error text is inserted above, the form grows by one line, the button moves down under the finger, and the tap lands on canvas. On 1280 the button is in the aside, so nothing moved.
- **Spec vs built:** the Figma Input hides the helper line when there is none (Expiry has no helper), so an error line is a layout change by design. The behavior note says "nothing else moves" for submit, and that promise should cover validation too.
- **Root cause:** component design. A message line that appears on demand shifts everything under it. This is a real-world checkout bug: people miss the Pay button on the first tap.
- **Fix, in order:**
  1. Code: `Input` always renders the message line with `min-h-4` (one caption line), empty when there is no message. That removed the shift for one-line messages. The expiry message wraps to three lines in a half-width column at 390, so the row still grew. Second part: blur validation now waits 150ms before showing an error, so a tap on Pay registers before anything renders. Both are in; neither alone was enough.
  2. Figma: Input description updated; the `Show helper` property stays, but the guidance is that the message row is always reserved in layouts where controls sit below a field. Open: rebuild the Input variants with a reserved 16px message row so the frames match the code exactly.
  3. Test: the mobile `validation errors` test now covers this by construction.
- **Lesson:** a state that adds a line is a layout change. Reserve the space in the component, not in every screen.

## F3 · 2026-10-08 · No frame for the timeout state

- **Found by:** the plan (`docs/run-plan.md`), before any code.
- **Where:** `docs/prompt.md` asks for a timeout path from the mocked payment call. The Figma page defines 9 states and none is a timeout.
- **Root cause:** the prompt and the frames were written separately. A state the code needs was never designed.
- **Fix:** code reuses the declined layout with its own copy ("We could not reach the payment provider. Nothing was charged. Check your connection and try again." with a Try again action). Closed the same day: `timeout` frames added at 1280 and 390 to the Checkout file, the page note now lists 10 states, and `tests/e2e/checkout.spec.ts` walks the timeout path with axe and a screenshot.
- **Lesson:** every outcome the prompt names must exist as a frame first, or the model writes the design.

## F2 · 2026-10-08 · Inline text action had no component

- **Found by:** the plan, step 2 of the prompt, under "What the system is missing".
- **Where:** "Billing address is the same as shipping. Change". The frame styles "Change" as `label` in `text/link`, inline with the sentence.
- **Spec vs built:** nothing in the library expresses it. `Button variant="tertiary"` is 44px tall with horizontal padding and would break the line. Rule 8 in `CLAUDE.md` says stop and say so instead of styling a raw element.
- **Root cause:** component coverage. The screen was designed with a text link that the system never defined.
- **Fix, in order:**
  1. Figma: new component set `Text link` (default, hover with underline, focus with 2px focus/ring, disabled), label style, `text/link`, description written. Library re-published.
  2. Code: `src/components/TextLink.tsx`, exported, added to `figma-map.json`, allowed in the guardrail as a component file.
  3. The screen uses `<TextLink>Change</TextLink>`.
- **Lesson:** the model following rule 8 is the point. It did not invent a styled span. The gap went into the system and the system got better.

## F4 · 2026-10-08 · Focus moved before the tap finished (mobile)

- **Found by:** Playwright, mobile project only. `validation errors` test: after tapping Pay with invalid fields, focus was expected on Card number and landed on the button.
- **Root cause:** `focus()` was called synchronously inside submit, and the tap's own focus on the button ran after it. Desktop passed because the event order differs.
- **Fix:** defer the focus move to the next frame (`requestAnimationFrame`), the same pattern the recovery action already used. No design change.
- **Lesson:** run the e2e suite on both projects from the start; mobile event order is not desktop event order.

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
