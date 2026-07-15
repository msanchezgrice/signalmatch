import { expect, test } from "@playwright/test";

test("marketing homepage renders", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /find users for your product/i }),
  ).toBeVisible();
});

test("marketing content remains visible without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /launch a clearly scoped campaign/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /common questions/i }),
  ).toBeVisible();

  await context.close();
});
