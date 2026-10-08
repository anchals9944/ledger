import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const theme = readFileSync(resolve(process.cwd(), "src/tokens/theme.css"), "utf8");
const source = JSON.parse(readFileSync(resolve(process.cwd(), "tokens/figma.tokens.json"), "utf8"));

describe("generated theme", () => {
  it("publishes every semantic color from the Figma export and nothing else", () => {
    const names: string[] = [];
    (function walk(node: Record<string, unknown>, path: string[]) {
      for (const [k, v] of Object.entries(node)) {
        if (k.startsWith("$")) continue;
        const t = v as Record<string, unknown>;
        if (t.$type === "color") names.push(`--color-${[...path, k].join("-")}`);
        else walk(t, [...path, k]);
      }
    })(source.semantic, []);
    for (const n of names) expect(theme, n).toContain(`${n}:`);
    expect(theme).not.toMatch(/--color-neutral-|--color-accent-|--color-red-|--color-green-/);
  });
  it("has no default Tailwind palette", () => {
    expect(theme).toContain("--color-*: initial;");
  });
  it("keeps the 44px control height from Figma", () => {
    expect(theme).toContain("--size-control-md: 44px;");
  });
});
