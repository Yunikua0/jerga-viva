import { expect, test } from "@playwright/test";

test("home shows a daily word whose link resolves", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Palabra del día" })).toBeVisible();
  const link = page.locator("[data-daily-link]");
  await expect(link).toHaveAttribute("href", /^\/palabra\/[a-z0-9-]+\/$/);
  await link.click();
  await expect(page).toHaveURL(/\/palabra\/[a-z0-9-]+\/$/);
  await expect(page.locator("h1")).toHaveCount(1);
});

test("share button copies the canonical url when navigator.share is missing", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
  });
  await page.goto("/palabra/viral/");
  await page.getByRole("button", { name: "Compartir" }).click();
  await expect(page.locator("[data-share-status]")).toHaveText("Enlace copiado");
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toMatch(/\/palabra\/viral\/$/);
});

test("home links to every category page", async ({ page }) => {
  await page.goto("/");
  for (const id of ["redes-sociales", "gen-z", "internet-gaming", "relaciones-actitudes"]) {
    await expect(page.locator(`a[href="/categoria/${id}/"]`).first()).toBeVisible();
  }
});
