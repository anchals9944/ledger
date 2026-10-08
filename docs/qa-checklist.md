# Design QA: Review and pay

Run after the gates pass. Compare the running app with the Figma frames side by side at
390 and 1280. One row per check. Record the finding, not an opinion.

| # | Check | Spec (Figma) | Built | Pass | Note |
|---|---|---|---|---|---|
| 1 | Type: heading | h1, Inter Semi Bold 24/32 | | | |
| 2 | Type: body and labels | body 16/24, label Medium 14/20, caption 12/16 | | | |
| 3 | Color: surfaces | canvas #F8F9FA, surface #FFFFFF, subtle #F1F3F5 | | | |
| 4 | Color: text | primary #12171D, secondary #515B67, placeholder #6F7A86 | | | |
| 5 | Color: CTA | primary bg #0B5C4D, hover #084A3E, text #FFFFFF | | | |
| 6 | Color: states | error #B42318 on #FDECEA, success #1F7A3A on #E6F4EA, selected #E3F1ED with #0B5C4D border | | | |
| 7 | Spacing: card padding and gaps | space/5 24 inside cards, space/4 16 between fields, space/6 32 between columns | | | |
| 8 | Radius | md 8 on controls, lg 12 on cards, full on radio dot | | | |
| 9 | Borders | 1px border/default; 2px focus and selected | | | |
| 10 | Control heights | Input 44, Button md 44, Button lg 52 | | | |
| 11 | Button hierarchy | One primary (Pay), Apply secondary, Back tertiary | | | |
| 12 | Hover states | primary darkens, secondary and tertiary get subtle bg | | | |
| 13 | Focus states | 2px focus/ring outside, visible on every control via keyboard | | | |
| 14 | Disabled states | disabled bg and text tokens; cursor not-allowed | | | |
| 15 | Loading state | spinner replaces icon, label "Processing payment", inputs disabled, no layout shift | | | |
| 16 | Validation errors | red border, alert icon, specific message replaces helper, focus to first invalid | | | |
| 17 | Declined | Alert at top of form, says no charge made, action clears card fields | | | |
| 18 | Promo applied | success Alert with Remove, Discount line, total $116.00 | | | |
| 19 | Promo invalid | field-level error on Code | | | |
| 20 | Success screen | order number, amount, card, receipt line, View order primary | | | |
| 21 | Empty cart | one primary action | | | |
| 22 | 390 layout | single column, summary first, 16px gutters, Expiry and CVC share a row | | | |
| 23 | 1280 layout | 960 content, 32 gap, 360 aside | | | |
| 24 | Icons | Lucide, 20px, 1.5 stroke, token colors | | | |
| 25 | Copy | matches frames word for word | | | |
| 26 | Hit targets | 44px minimum, radio card whole area | | | |
| 27 | Semantics | labels linked, aria-invalid, role=alert on errors, role=status on success | | | |
| 28 | axe | 0 violations at both widths | | | |
| 29 | Screenshot diff | within 1% of the Figma export at both widths | | | |
| 30 | Raw values | `npm run lint:tokens` passes | | | |

## Findings

Record each gap as: what, where, spec vs built, root cause (prompt, component, token,
rules, or generation), and where the fix went (Figma, code, rules).
