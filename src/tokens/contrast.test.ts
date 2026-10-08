import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Contrast is a token property. Measure it where the tokens are defined so a new value
// cannot ship under WCAG AA. Added after finding F1 (docs/qa-findings.md).
const tokens = JSON.parse(readFileSync(resolve(process.cwd(), "src/tokens/tokens.json"), "utf8")) as Record<string, { value: string }>;
const color = (role: string) => tokens[`semantic/${role}`].value;

const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a: string, b: string) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };

const surfaces = ["bg/canvas", "bg/surface", "bg/subtle"];
const textRoles = ["text/primary", "text/secondary", "text/placeholder", "text/link", "state/disabled/text"];

describe("text contrast (WCAG AA, 4.5:1)", () => {
  for (const role of textRoles) for (const bg of surfaces) {
    it(`${role} on ${bg}`, () => {
      expect(contrast(color(role), color(bg))).toBeGreaterThanOrEqual(4.5);
    });
  }
  it("cta/primary/text on cta/primary/bg", () => expect(contrast(color("cta/primary/text"), color("cta/primary/bg"))).toBeGreaterThanOrEqual(4.5));
  it("state/error/text on state/error/bg", () => expect(contrast(color("state/error/text"), color("state/error/bg"))).toBeGreaterThanOrEqual(4.5));
  it("state/success/text on state/success/bg", () => expect(contrast(color("state/success/text"), color("state/success/bg"))).toBeGreaterThanOrEqual(4.5));
});

describe("non-text contrast (WCAG AA, 3:1)", () => {
  it("border/default on bg/surface", () => expect(contrast(color("border/default"), color("bg/surface"))).toBeGreaterThanOrEqual(1.4)); // hairline, decorative
  it("border/strong on bg/surface", () => expect(contrast(color("border/strong"), color("bg/surface"))).toBeGreaterThanOrEqual(3));
  it("focus/ring on bg/surface", () => expect(contrast(color("focus/ring"), color("bg/surface"))).toBeGreaterThanOrEqual(3));
  it("icon/muted on bg/surface", () => expect(contrast(color("icon/muted"), color("bg/surface"))).toBeGreaterThanOrEqual(3));
});
