# Ledger

A small design system and one checkout screen, built Figma to code with Claude Code.
The point is the workflow: tokens flow from Figma, components mirror Figma sets, the
model reads the frame and the rules, and the QA that follows feeds fixes back into the
system. Seven findings from one screen are logged in `docs/qa-findings.md`, four of them
changed the Figma library.

Figma: **Ledger Design System** (tokens, 6 component sets, 12 icons) and **Ledger
Checkout** (the "Review and pay" screen in 10 states at 390 and 1280, with behavior notes).

## The loop

```
Figma variables  ──export──▶  tokens/figma.tokens.json  (W3C DTCG)
                                      │  npm run tokens  (Style Dictionary)
                                      ▼
                              src/tokens/theme.css      (Tailwind v4 @theme, no default palette)
Figma components ──mirror──▶  src/components/*          (Button, Input, RadioCard, Card, Alert, TextLink)
                              src/components/figma-map.json
CLAUDE.md  +  docs/prompt.md  ──▶  Claude Code reads the frame through the Figma connection
                                      ▼
                              src/screens/ReviewAndPay.tsx
                                      │  npm run check      lint, token guardrail, unit tests, build
                                      │  npm run test:e2e   axe + screenshots, every state, both widths
                                      ▼
                              docs/qa-checklist.md, docs/qa-findings.md
                                      │  a gap found here is fixed in Figma first, then re-exported
                                      └────────────────────────────────────────────────▲
```

## Run it

```
npm install
npm run tokens      # regenerate the theme from the Figma export
npm run dev         # /checkout is the screen, / is the component showcase
npm run check       # tokens + lint + guardrail + unit tests + build
npm run test:e2e    # Playwright at 390 and 1280 with axe
```

Test cards in the mocked payment call: `4242 4242 4242 4242` succeeds,
`4000 0000 0000 0002` is declined, `4000 0000 0000 0010` times out. Promo `SAVE10`.
No real payment provider is involved.

## What's in the repo

| Path | What |
|---|---|
| `tokens/figma.tokens.json` | The variables export from Figma, with code syntax and scopes |
| `sd.config.mjs` | Style Dictionary: export → `@theme` |
| `src/tokens/` | Generated theme and the contrast test that guards it |
| `src/components/` | The six components, one per Figma set, plus the Figma map |
| `src/screens/ReviewAndPay.tsx` | The generated screen |
| `src/screens/payment.ts` | The mocked payment call and validators |
| `scripts/check-raw-values.mjs` | The guardrail: no raw colors, no raw buttons, no off-scale spacing |
| `tests/e2e/` | Playwright: every state, both widths, axe, screenshot references |
| `CLAUDE.md` | The rules the model reads first |
| `docs/prompt.md` | The exact brief for the generation run |
| `docs/run-plan.md` | The plan the model wrote before code, including what the system was missing |
| `docs/qa-checklist.md` | 33 checks, pass 1 and pass 2 |
| `docs/qa-findings.md` | F1 to F7: what, where, root cause, where the fix went |

## Decisions

- **Code Connect is not used.** It needs an Organization plan. `figma-map.json` does the
  same job for the model: Figma set → React component and props.
- **Tailwind v4 with `@theme`** and the default palette removed, so a color that is not a
  token does not exist as a class.
- **Spacing is px/4** with only the Figma steps allowed (1 2 3 4 6 8 12 16). See F6 for
  why the first version got this wrong.
- **One primary button per screen.** The hierarchy is a rule in `CLAUDE.md`, not a habit.
