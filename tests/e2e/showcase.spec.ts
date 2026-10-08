import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("component showcase has no accessibility violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Ledger components" })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test("focus is visible on every control", async ({ page }) => {
  await page.goto("/");
  const pay = page.getByRole("button", { name: "Pay $128.00" }).first();
  await pay.focus();
  await expect(pay).toHaveCSS("box-shadow", /rgb\(19, 140, 114\)/); // focus/ring = accent/500 — tokens-allow
});

test("showcase matches the reference screenshot", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot({ fullPage: true, maxDiffPixelRatio: 0.01 });
});
