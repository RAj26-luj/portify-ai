import { test, expect } from "@playwright/test";

test("dashboard redirects unauthenticated user", async ({
  page,
}) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(
    /login/
  );
});