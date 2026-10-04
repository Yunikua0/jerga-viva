import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";

export default defineConfig({
  site: process.env.SITE_URL ?? "https://jerga-viva.pages.dev",
  trailingSlash: "always",
  integrations: [sitemap({ filter: (page) => !page.includes("/404") }), pagefind()],
  vite: { plugins: [tailwindcss()] },
});
