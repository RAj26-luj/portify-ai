import { test, expect } from "@playwright/test";

test("login page loads", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
  await expect(page.locator('input[placeholder="Password"]')).toBeVisible();

  await expect(
    page.getByRole("button", { name: /^sign in$/i })
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: /continue with google/i })
  ).toBeVisible();
});