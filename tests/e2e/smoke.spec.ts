import { expect, test } from "@playwright/test";

test("marketing homepage renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /find users for your product/i })).toBeVisible();
});
