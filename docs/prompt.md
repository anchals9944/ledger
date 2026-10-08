# The prompt

This is the exact brief given to Claude Code for the generation step, with the Figma
connection on and `CLAUDE.md` loaded. Saved verbatim so the run can be repeated.

---

You are the front-end engineer on Ledger. Read `CLAUDE.md` first.

**Task.** Build the "Review and pay" checkout screen as `src/screens/ReviewAndPay.tsx`
from this Figma frame, and wire it as the app's route:

https://www.figma.com/design/OljKS32WSEmXRERf2ftwNe/Ledger-Checkout?node-id=3-301

The frame is the 1280 default state. The 390 default state is node `4:684`. The other
states are the sibling frames on the same page; read the four `_note` frames above them
for behavior, focus order, accessibility and breakpoint rules.

**Constraints.**
- Use only the components in `src/components` and the token utilities in
  `src/tokens/theme.css`. Map Figma components with `src/components/figma-map.json`.
- Every state in the Figma page must be reachable in the running app: default, field
  focus, validation errors, promo applied, promo invalid, submitting, declined, success,
  empty cart. Drive them from real form state and a mocked payment call in
  `src/screens/payment.ts` that returns `ok`, `declined` or `timeout` based on the card
  number (4242… ok, 4000 0000 0000 0002 declined, 4000 0000 0000 0010 timeout).
- Validation on blur and on submit, field-level messages that say how to fix the
  problem, focus moves to the first invalid field. Nothing is charged until Pay is
  pressed, and the UI says so.
- Responsive: 390 single column with the summary first; 1280 two columns with a
  360px aside. No third layout.
- Accessibility: labels, `inputMode`, `autocomplete`, `aria-invalid`, live regions as
  the notes specify, 44px hit targets, visible focus. `npm run test:e2e` must pass axe.
- Copy exactly as in the frames. Prices: items $68.00 and $50.00, shipping $10.00,
  SAVE10 takes $12.00 off.

**Process.**
1. Read the frame and the notes with the Figma connection. List the components and
   tokens the frame uses, matched to `figma-map.json`.
2. Write the plan before any code: layout, components, state model, the states and how
   each is reached, anything the system is missing. If something is missing, stop and
   say so instead of inventing it.
3. Implement. Add a Playwright test in `tests/e2e/checkout.spec.ts` that walks every
   state at both widths, runs axe, and takes screenshots.
4. Run `npm run check` and `npm run test:e2e`. Report what passed, what failed, and what
   you changed to fix it.

Do not add dependencies. Do not edit `src/tokens/` or `tokens/`.
