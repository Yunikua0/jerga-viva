import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 360, height: 740 } });

const routes = ["/", "/a-z/", "/categoria/gen-z/", "/palabra/viral/", "/buscar/", "/acerca/"];

for (const route of routes) {
  test(`no horizontal scroll at 360px on ${route}`, async ({ page }) => {
    await page.goto(route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
