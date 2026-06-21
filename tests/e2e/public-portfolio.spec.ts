import { test, expect } from "@playwright/test";

test("public portfolio page loads", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("body")).toBeVisible();
});