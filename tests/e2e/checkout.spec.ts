import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Walks every state the Figma page defines, at both widths (projects), with axe at each stop.
const OK = "4242 4242 4242 4242", DECLINED = "4000 0000 0000 0002";

async function axe(page: Page, label: string) {
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(r.violations, `${label}: ${JSON.stringify(r.violations, null, 2)}`).toEqual([]);
}
async function fillCard(page: Page, number = OK) {
  await page.getByLabel("Card number").fill(number);
  await page.getByLabel("Expiry").fill("0829");
  await page.getByLabel("CVC").fill("123");
  await page.getByLabel("Name on card").fill("Anchal Nagdev");
}

test("default", async ({ page }) => {
  await page.goto("/checkout");
  await expect(page.getByRole("heading", { name: "Review and pay" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Pay $128.00" })).toBeVisible();
  await axe(page, "default");
  await expect(page).toHaveScreenshot("default.png", { fullPage: true, maxDiffPixelRatio: 0.01 });
});

test("field focus", async ({ page }) => {
  await page.goto("/checkout");
  await page.getByLabel("Card number").focus();
  await expect(page.getByLabel("Card number")).toBeFocused();
  await axe(page, "focus");
  await expect(page).toHaveScreenshot("field-focus.png", { fullPage: true, maxDiffPixelRatio: 0.01 });
});

test("validation errors on submit, focus moves to the first invalid field", async ({ page }) => {
  await page.goto("/checkout");
  await page.getByLabel("Expiry").fill("0120");
  await page.getByRole("button", { name: "Pay $128.00" }).click();
  await expect(page.getByLabel("Card number")).toBeFocused();
  await expect(page.getByLabel("Card number")).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("This card has expired. Use a card with a later date.")).toBeVisible();
  await axe(page, "errors");
  await expect(page).toHaveScreenshot("validation-errors.png", { fullPage: true, maxDiffPixelRatio: 0.01 });
});

test("promo applied lowers the total", async ({ page }) => {
  await page.goto("/checkout");
  await page.getByLabel("Code").fill("save10");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Promo code applied" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Pay $116.00" })).toBeVisible();
  await axe(page, "promo applied");
  await expect(page).toHaveScreenshot("promo-applied.png", { fullPage: true, maxDiffPixelRatio: 0.01 });
});

test("promo invalid shows a field error", async ({ page }) => {
  await page.goto("/checkout");
  await page.getByLabel("Code").fill("SAVE20");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByText("That code is not valid. Check the spelling or try another.")).toBeVisible();
  await axe(page, "promo invalid");
  await expect(page).toHaveScreenshot("promo-invalid.png", { fullPage: true, maxDiffPixelRatio: 0.01 });
});

test("submitting locks the form and keeps the layout", async ({ page }) => {
  await page.goto("/checkout");
  await fillCard(page);
  const pay = page.getByRole("button", { name: "Pay $128.00" });
  const before = await pay.boundingBox();
  await pay.click();
  const processing = page.getByRole("button", { name: "Processing payment" });
  await expect(processing).toHaveAttribute("aria-busy", "true");
  await expect(page.getByLabel("Card number")).toBeDisabled();
  const after = await processing.boundingBox();
  expect(after?.height).toBe(before?.height);
  await expect(page).toHaveScreenshot("submitting.png", { fullPage: true, maxDiffPixelRatio: 0.01 });
});

test("declined says no charge was made and offers recovery", async ({ page }) => {
  await page.goto("/checkout");
  await fillCard(page, DECLINED);
  await page.getByRole("button", { name: "Pay $128.00" }).click();
  const alert = page.getByRole("alert").filter({ hasText: "Your card was declined" });
  await expect(alert).toContainText("No charge was made");
  await axe(page, "declined");
  await expect(page).toHaveScreenshot("declined.png", { fullPage: true, maxDiffPixelRatio: 0.01 });
  await page.getByRole("button", { name: "Use a different card" }).click();
  await expect(page.getByLabel("Card number")).toBeFocused();
  await expect(page.getByLabel("Card number")).toHaveValue("");
});

test("success names the order, amount and card", async ({ page }) => {
  await page.goto("/checkout");
  await fillCard(page);
  await page.getByRole("button", { name: "Pay $128.00" }).click();
  await expect(page.getByRole("heading", { name: "Payment complete" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("$128.00 charged to Visa ····4242");
  await axe(page, "success");
  await expect(page).toHaveScreenshot("success.png", { fullPage: true, maxDiffPixelRatio: 0.01 });
});

test("empty cart", async ({ page }) => {
  await page.goto("/checkout?cart=empty");
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
  await axe(page, "empty");
  await expect(page).toHaveScreenshot("empty-cart.png", { fullPage: true, maxDiffPixelRatio: 0.01 });
});

test("tab order ends on Back to shipping", async ({ page }) => {
  await page.goto("/checkout");
  await page.getByLabel("Name on card").focus();
  await page.keyboard.press("Tab"); // Change
  await page.keyboard.press("Tab"); // Code
  await page.keyboard.press("Tab"); // Apply (disabled until a code is typed, so skipped)
  await expect(page.getByRole("button", { name: /Pay \$/ })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Back to shipping" })).toBeFocused();
});
