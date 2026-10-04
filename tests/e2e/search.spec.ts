import { expect, test } from "@playwright/test";

test("searching 'cringe' lists the cringe entry", async ({ page }) => {
  await page.goto("/buscar/");
  await page.locator(".pf-searchbox-input").fill("cringe");
  const result = page.locator(".pf-searchbox-result", { hasText: "Cringe" }).first();
  await expect(result).toBeVisible();
  await expect(result).toHaveAttribute("href", /\/palabra\/cringe\//);
});

test("searching nonsense shows no result links", async ({ page }) => {
  await page.goto("/buscar/");
  await page.locator(".pf-searchbox-input").fill("zzqxjv");
  await expect(page.locator(".pf-searchbox-result")).toHaveCount(0);
});
