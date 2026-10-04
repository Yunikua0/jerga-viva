import { expect, test } from "@playwright/test";

test("first Tab stop is the skip link and it targets main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = page.locator(":focus");
  await expect(focused).toHaveText("Saltar al contenido");
  await expect(focused).toHaveAttribute("href", "#main");
});

test("main navigation links are reachable with Tab", async ({ page }) => {
  await page.goto("/");
  const labels = ["Inicio", "A–Z", "Buscar", "Acerca"];
  const reached: string[] = [];
  for (let i = 0; i < 12 && reached.length < labels.length; i++) {
    await page.keyboard.press("Tab");
    const text = ((await page.locator(":focus").textContent()) ?? "").trim();
    if (labels.includes(text) && !reached.includes(text)) reached.push(text);
  }
  expect(reached.sort()).toEqual([...labels].sort());
});

test("search input on /buscar/ is reachable by keyboard", async ({ page }) => {
  await page.goto("/buscar/");
  let found = false;
  for (let i = 0; i < 20 && !found; i++) {
    await page.keyboard.press("Tab");
    found = await page
      .locator(".pf-searchbox-input")
      .evaluate((el) => el === document.activeElement);
  }
  expect(found).toBe(true);
});
