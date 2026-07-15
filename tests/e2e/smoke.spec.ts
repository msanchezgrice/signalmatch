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

test("consented analytics records the initial page view after tags initialize", async ({
  page,
}) => {
  await page.route("**/gtag/js**", (route) => route.abort());
  await page.route("**/fbevents.js", (route) => route.abort());

  await page.goto("/");
  await page.getByRole("button", { name: "Accept all" }).click();

  await expect
    .poll(() =>
      page.evaluate(() =>
        window.dataLayer?.some(
          (entry) =>
            typeof entry === "object" &&
            entry !== null &&
            (entry as Record<number, unknown>)[0] === "event" &&
            (entry as Record<number, unknown>)[1] === "page_view",
        ),
      ),
    )
    .toBe(true);

  await expect
    .poll(() =>
      page.evaluate(() => {
        const queue = (
          window.fbq as ((...args: unknown[]) => void) & {
            queue?: Array<Record<number, unknown>>;
          }
        )?.queue;
        return queue?.some(
          (entry) => entry[0] === "track" && entry[1] === "PageView",
        );
      }),
    )
    .toBe(true);
});
