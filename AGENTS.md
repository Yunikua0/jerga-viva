# AGENTS.md

Jerga Viva: diccionario estático de jerga moderna en español (Astro + Tailwind + Pagefind).
La fuente de verdad de las instrucciones es `CLAUDE.md`; este archivo es un resumen.

Comandos: `npm run check`, `npm run lint`, `npm test`, `npm run build`, `node scripts/check-dist.mjs --full`, `npm run test:e2e`.

Tres reglas clave:
1. Todo el contenido vive en `src/data/words.json` y se valida con `src/lib/word-schema.ts`.
2. No se añade nada fuera de alcance (cuentas, envío de palabras, imágenes OG, multi-idioma).
3. Cada paso termina con `npm run format`, sus comprobaciones en verde y un `git tag step-NN-slug`.
