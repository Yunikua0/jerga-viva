import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { SITE_FALLBACK_URL } from "../lib/site";
import { compareTerms } from "../lib/text";
import { CATEGORIES, CATEGORY_LABELS } from "../lib/word-schema";

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(SITE_FALLBACK_URL);
  const url = (path: string) => new URL(path, base).href;
  const words = (await getCollection("words")).sort((a, b) =>
    compareTerms(a.data.term, b.data.term),
  );

  const lines = [
    "# Jerga Viva",
    "",
    "> El diccionario de la jerga moderna en español: significado, ejemplos y origen de palabras de redes sociales, Gen Z, gaming y relaciones.",
    "",
    "## Categorías",
    "",
    ...CATEGORIES.map((id) => `- [${CATEGORY_LABELS[id]}](${url(`/categoria/${id}/`)})`),
    "",
    "## Palabras",
    "",
    ...words.map(
      (entry) =>
        `- [${entry.data.term}](${url(`/palabra/${entry.id}/`)}): ${entry.data.definition}`,
    ),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
