import { test, expect } from "@playwright/test";

test("login page loads", async ({ page }) => {
  await page.goto("/login?e2e=true");

  await expect(page.getByRole("heading", { name: "Welcome Back" })).toBeVisible();

  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();

  await expect(page.getByRole("button", { name: /authorize session/i })).toBeVisible();

  await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible();
});
