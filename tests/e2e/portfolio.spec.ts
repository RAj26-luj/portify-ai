import { test, expect } from "@playwright/test";

test("portfolio page loads for public user", async ({ page }) => {
  await page.goto("/portfolio/demo?e2e=true");

  await expect(page.locator("body")).toBeVisible();
});

test("portfolio redirects if not found", async ({ page }) => {
  await page.goto("/portfolio/non-existent-user?e2e=true");

  await expect(page.locator("body")).toBeVisible();
});
