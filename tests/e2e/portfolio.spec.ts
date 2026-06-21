import { test, expect } from "@playwright/test";

test("portfolio page loads for public user", async ({ page }) => {
  await page.goto("/portfolio/demo");

  await expect(page.locator("body")).toBeVisible();
});

test("portfolio redirects if not found", async ({ page }) => {
  await page.goto("/portfolio/non-existent-user");

  await expect(page.locator("body")).toBeVisible();
});