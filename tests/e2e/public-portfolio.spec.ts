import { test, expect } from "@playwright/test";

test("public portfolio page loads", async ({ page }) => {
  await page.goto("/?e2e=true");

  await expect(page.locator("body")).toBeVisible();
});
