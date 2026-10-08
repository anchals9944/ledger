# Ledger: rules for generating UI in this repo

Read this before writing or changing any UI. It is short on purpose. The tokens and
components are the system; this file only says how to use them.

## Where things come from

- **Tokens** are generated. `tokens/figma.tokens.json` is the export from the Ledger
  Design System Figma file (`S6tPQwUGxVVE1bOlAuFRPR`). `npm run tokens` turns it into
  `src/tokens/theme.css` (Tailwind v4 `@theme`) and `src/tokens/tokens.json`. Never edit
  the generated files. To change a value, change it in Figma and re-export.
- **Components** live in `src/components/`. Each one mirrors a Figma component set and
  its variant names: `Button`, `Input`, `RadioCard`, `Card`, `Alert`. The map from Figma
  component to React component and props is `src/components/figma-map.json`.
- **Icons** are Lucide, 20px in controls, `strokeWidth={1.5}`, colored by `text-icon-*`.

## Rules

1. Use only token utilities. Colors are `bg-*`, `text-*`, `border-*` with the names in
   `theme.css` (`bg-cta-primary-bg`, `text-text-secondary`, `border-border-default`).
   Spacing is `p-4`, `gap-3` on the token scale. Type is `text-h1`, `text-body`,
   `text-label`, `text-caption`. There is no default Tailwind palette in this project,
   so `bg-gray-100` or `text-blue-600` will not exist.
2. Never write a raw color, `rgb()`, `hsl()`, a hex value, or an arbitrary pixel value
   like `p-[10px]`. `npm run lint:tokens` fails the build if you do.
3. Never write a raw `<button>` or `<input>` outside `src/components/`. Use `Button`,
   `Input`, `RadioCard`. Use `Card` for surfaces and `Alert` for messages.
4. One primary button per screen. Secondary for the supporting action, tertiary for
   Back or Cancel.
5. Every interactive element gets a visible focus state and a 44px minimum hit target.
   Every image gets `alt`. Every icon-only control gets `aria-label`.
6. Every screen is built for 390 and 1280 wide. Design every state the Figma frame
   shows: default, focus, validation errors, loading, error recovery, success, empty.
7. Error copy says what happened, whether anything was charged, and how to recover.
8. **If a variant, token or state you need does not exist, stop and say so.** Do not
   invent a color, add a one-off style, or approximate. Propose the addition to the
   system instead; the fix goes into Figma first, then the export, then the code.

## How to work from a Figma frame

1. Read the frame with the Figma connection (`get_design_context`, `get_variable_defs`).
2. List the components and tokens the frame uses, matched to `figma-map.json`.
3. Write a plan: layout, components, states, breakpoints, anything missing from the system.
4. Only then write code. Then run `npm run check`.

## Checks

`npm run check` runs: token build, ESLint, the token guardrail, unit tests, build.
`npm run test:e2e` runs Playwright at 390 and 1280 with axe accessibility checks and
screenshot comparison against the Figma frames in `tests/e2e/__screenshots__`.
