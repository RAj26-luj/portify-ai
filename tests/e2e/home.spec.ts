import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/?e2e=true");

  await expect(page.locator("body")).toBeVisible();
});
