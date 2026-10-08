# Design QA: Review and pay

Run after the gates pass. Compared the Playwright renders (`tests/e2e/__screenshots__`)
with the Figma frames side by side at 390 and 1280, 2026-10-08, after findings F1 to F6.
Pass 1 is the first run; Pass 2 is after the fixes.

| # | Check | Spec (Figma) | Pass 1 | Pass 2 | Note |
|---|---|---|---|---|---|
| 1 | Type: heading | h1, Inter Semi Bold 24/32 | ✓ | ✓ | |
| 2 | Type: body and labels | body 16/24, label Medium 14/20, caption 12/16 | ✓ | ✓ | |
| 3 | Color: surfaces | canvas #F8F9FA, surface #FFFFFF, subtle #F1F3F5 | ✓ | ✓ | |
| 4 | Color: text | primary #12171D, secondary #515B67, placeholder (neutral/500) | ✗ | ✓ | F1: neutral/500 #6F7A86 → #5F6B7A |
| 5 | Color: CTA | primary bg #0B5C4D, hover #084A3E, text #FFFFFF | ✓ | ✓ | |
| 6 | Color: states | error, success, selected tokens | ✓ | ✓ | |
| 7 | Spacing: card padding and gaps | 24 inside cards, 16 between fields, 32 between columns | ✗ | ✓ | F6: `p-5` meant 24 but the scale was mis-mapped |
| 8 | Radius | md 8 controls, lg 12 cards, full radio dot | ✓ | ✓ | |
| 9 | Borders | 1px default; 2px focus and selected | ✓ | ✓ | |
| 10 | Control heights | Input 44, Button md 44, lg 52 | ✓ | ✓ | |
| 11 | Button hierarchy | One primary, Apply secondary, Back tertiary | ✓ | ✓ | |
| 12 | Hover states | primary darkens, secondary/tertiary subtle bg | ✓ | ✓ | checked manually in the browser |
| 13 | Focus states | 2px focus ring, keyboard visible on every control | ✓ | ✓ | e2e `field focus`, showcase focus test |
| 14 | Disabled states | disabled tokens, cursor | ✓ | ✓ | submitting screenshot |
| 15 | Loading state | spinner, "Processing payment", inputs disabled, no layout shift | ✓ | ✓ | e2e asserts button height unchanged |
| 16 | Validation errors | red border, icon, message replaces helper, focus to first invalid | ✗ (mobile) | ✓ | F4 focus timing, F5 layout shift |
| 17 | Declined | Alert at top, "No charge was made", recovery clears card fields | ✓ | ✓ | |
| 18 | Promo applied | success Alert, Discount line, total $116.00 | ✓ | ✓ | |
| 19 | Promo invalid | field-level error on Code | ✓ | ✓ | |
| 20 | Success screen | order, amount, card, receipt line, View order primary | ✓ | ✓ | |
| 21 | Empty cart | one primary action | ✓ | ✓ | |
| 22 | 390 layout | single column, summary first, 16 gutters, Expiry + CVC in a row | ✓ | ✓ | |
| 23 | 1280 layout | 960 content, 32 gap, 360 aside, sticky | ✓ | ✓ | sticky is a code addition the frame implies |
| 24 | Icons | Lucide, 20px, 1.5 stroke, token colors | ✗ | ✓ | F6: `size-5` resolved to nothing, SVG stayed 24 |
| 25 | Copy | matches frames word for word | ✓ | ✓ | timeout copy exists only in code (F3) |
| 26 | Hit targets | 44 minimum, radio card whole area | ✓ | ✓ | |
| 27 | Semantics | labels, aria-invalid, role=alert, role=status, fieldset label | ✗ | ✓ | fieldset pointed at a missing id; fixed before e2e |
| 28 | axe | 0 violations at both widths, every state | ✗ | ✓ | F1 |
| 29 | Screenshot diff | within 1% of reference at both widths | ✓ | ✓ | references regenerated after F6 |
| 30 | Raw values | `npm run lint:tokens` passes | ✓ | ✓ | the rule set grew in F6 |
| 31 | Radio selected dot | 10px dot inside the ring | ✗ | ✓ | F6: `size-2.5` resolved to nothing |
| 32 | Apply alignment | level with the Code field | ✗ | ✓ | F6: `mt-7` resolved to nothing |
| 33 | Inline text action | "Change" inline in the sentence | ✗ | ✓ | F2: TextLink added to the system |

Pass 1: 24 of 33. Pass 2: 33 of 33.

## Findings

See `docs/qa-findings.md`. F1, F2, F5 and F6 went back into the Figma library; F3 is
open on the design side; F4 was code only.
