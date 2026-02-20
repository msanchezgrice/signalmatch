import { expect, test } from "@playwright/test";

test("marketing homepage renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /high-trust performance growth/i })).toBeVisible();
});
