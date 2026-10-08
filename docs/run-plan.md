# Generation run: plan before code

Written from the Figma frame `3:301` (1280 default), `4:684` (390 default), the 16
sibling state frames and the four `_note` frames, read through the Figma connection on
2026-10-08. This is step 2 of `docs/prompt.md`. No code existed when this was written.

## What the frame uses, mapped to the system

| Figma | Count | Code (`figma-map.json`) |
|---|---|---|
| Card (default) | 3 | `Card` |
| Card (summary) | 1 | `Card variant="summary" total={...}` |
| Radio card | 3 | `RadioCard` in a `fieldset` with `name="method"` |
| Input | 5 | `Input` (Card number, Expiry, CVC, Name on card, Code) |
| Button primary lg + icon/lock | 1 | `Button variant="primary" size="lg" iconLeft={<Lock/>}` |
| Button secondary md | 1 | `Button variant="secondary"` (Apply) |
| Button tertiary md + icon/arrow-left | 1 | `Button variant="tertiary" iconLeft={<ArrowLeft/>}` |
| Alert error / success | states only | `Alert` |
| icon/shield-check | 1 | `ShieldCheck` |
| Text styles | caption, h1, h2, label, body, body-sm | `text-caption` … utilities |
| Variables | bg/canvas, bg/surface, bg/subtle, text/*, border/*, cta/*, state/*, spacing 2–8, radius md/lg | token utilities |

## Layout

- Page: `bg-bg-canvas`, vertical padding `py-16` (space/8), horizontal `px-8` (space/6).
- Content column: `max-w-[960px]` centered, `gap-8` (space/6).
- 1280: `grid grid-cols-[1fr_360px] gap-8`. Form left, aside right. Aside is sticky so the total and Pay stay visible while the form scrolls.
- 390: single column, `px-4` gutters, order: header, summary, form, pay block. The grid switches at `lg` (1024). No third layout, per the Breakpoints note.
- Expiry and CVC share a row with `gap-3`, `items-start` so the CVC helper does not push Expiry down.

## State model

One `useReducer`-free component with explicit state:

```
values: { method, number, expiry, cvc, name, promo }
touched: Set<field>             // validation shows on blur and on submit
errors: { number?, expiry?, cvc?, name? }
promoState: idle | applied | invalid
status: idle | submitting | declined | timeout | success
cart: items[] (empty -> empty cart screen)
```

How each Figma state is reached:

| Figma frame | How |
|---|---|
| default | initial |
| field focus | keyboard or click; CSS `focus-within` on `Input` |
| validation errors | blur a field with a bad value, or press Pay with empty fields |
| promo applied | enter `SAVE10`, Apply |
| promo invalid | any other code, Apply |
| submitting | Pay with valid fields; `status = submitting` until the mock resolves |
| declined | card `4000 0000 0000 0002` |
| success | card `4242 4242 4242 4242` |
| empty cart | `?cart=empty` query, or Remove all items (not in frame; query only) |

Mock payment in `src/screens/payment.ts`: 900ms delay, resolves by card number.
`timeout` (card ending 0010) shows the error Alert with a retry action; the frame set has
no timeout frame, so it reuses the declined layout with different copy. Flagged below.

## Behavior from the notes

- Submit: `status = submitting`, Pay shows loading with "Processing payment", every
  control gets `disabled`, no layout shift (the button keeps its height; the spinner
  replaces the icon).
- Validation: on blur per field, on submit for all. Field-level only. Error text replaces
  helper text. Focus moves to the first invalid field.
- Declined: Alert at the top of the form, `role="alert"`, says no charge was made.
  "Use a different card" clears the card fields and focuses Card number.
- Promo: Apply validates. Applied: success Alert with Remove, Discount line, total
  $116.00. Invalid: field error on Code.
- Success and empty cart replace the whole screen.

## Accessibility

- `inputMode="numeric"` and `autoComplete` `cc-number`, `cc-exp`, `cc-csc`, `cc-name`.
- Radio group in a `fieldset` with a visually hidden `legend`? No: the Card title
  "Payment method" is the visible group label, so `aria-labelledby` points at it.
- Live regions as specified. Focus ring from the components. 44px targets from the
  components.
- Tab order follows DOM order, which matches the note (Back is last).

## What the system is missing

1. **Inline text action.** "Change" next to "Billing address is the same as shipping."
   is a text link in the frame. There is no component for an inline text action:
   `Button variant="tertiary"` is 44px tall with padding, which would break the line.
   Rule 8 says stop and say so. **Decision:** add `TextLink` to the system (Figma
   component with default, hover, focus states; `TextLink` in code), then use it.
   Logged as finding F2.
2. **Timeout state.** The prompt asks for a timeout path; the Figma page has no frame
   for it. Reusing the declined layout with "We could not reach the payment provider.
   Nothing was charged. Try again." Logged as F3 for the design to add the frame.
3. Nothing else. Every other element maps to an existing component or token.
