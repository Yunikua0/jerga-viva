import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/a-z/", "/categoria/gen-z/", "/palabra/viral/", "/buscar/", "/acerca/"];

for (const colorScheme of ["light", "dark"] as const) {
  for (const route of routes) {
    test(`no axe violations on ${route} (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .exclude(".pagefind-ui")
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
