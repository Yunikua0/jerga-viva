# Jerga Viva

Diccionario web gratuito de jerga moderna en español: redes sociales, Gen Z, gaming y relaciones.
Cada palabra tiene su propia página con definición corta, dos ejemplos, origen y palabras
relacionadas. El sitio es 100% estático (Astro + Tailwind + Pagefind): sin servidor, sin base de
datos y sin cuentas. El contenido son 100 entradas guardadas en `src/data/words.json`.

> "Jerga Viva" es un nombre provisional: vive en la constante `SITE_NAME` de `src/lib/site.ts`.

## Requisitos

- Node 24 LTS (el archivo `.nvmrc` fija la major)
- npm (incluido con Node)
- Un shell tipo bash (en Windows, Git Bash)

## Comandos

| Tarea | Comando |
|---|---|
| Instalar dependencias | `npm install` |
| Servidor de desarrollo | `npm run dev` |
| Compilar el sitio a `dist/` | `npm run build` |
| Servir `dist/` en local | `npm run preview` |
| Tests unitarios | `npm test` |
| Tests e2e (necesitan `npm run build` antes) | `npm run test:e2e` |
| Auditoría de `dist/` | `npm run audit:dist` |
| Tipos | `npm run check` |
| Lint / formato | `npm run lint` / `npm run format` |

La primera vez que ejecutes los tests e2e instala el navegador con `npx playwright install chromium`.

## Cómo añadir una palabra

1. Añade un objeto a `src/data/words.json` siguiendo el esquema de `src/lib/word-schema.ts`
   y el contrato de redacción del blueprint (§4): definición de una sola oración (≤ 220
   caracteres), exactamente 2 ejemplos, origen verdadero (si no se sabe, "Origen incierto: …"),
   de 1 a 3 palabras relacionadas y la `sensitivity` correcta. El `id` es el `term` en minúsculas,
   sin tildes y con guiones (`slugify(term) === id`).
2. Añade su `id` a la categoría correspondiente de `tests/fixtures/headwords.json`. El blueprint
   fija 25 titulares por categoría: si añades una palabra, ajusta también esa aserción en
   `tests/unit/coverage.test.ts`.
3. Ejecuta `npm test`, `npm run build` y `node scripts/check-dist.mjs`.

## Cómo desplegar en Cloudflare Pages

Conecta el repositorio y usa estos valores:

| Ajuste | Valor |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Variable de entorno `NODE_VERSION` | `24` (si el panel no la reconoce, `.nvmrc` ya fija la major) |
| Variable de entorno `SITE_URL` | La URL final del sitio, por ejemplo `https://jerga-viva.pages.dev` |

`SITE_URL` se usa para el canonical, el sitemap, `robots.txt` y `llms.txt`. Si no se define, el
sitio usa `https://jerga-viva.pages.dev`. Para probarla en local, expórtala en el propio comando:
`SITE_URL=https://example.test npm run build`.

## Nota sobre el contenido

Las definiciones se redactaron con ayuda de inteligencia artificial y todavía no han pasado por una
revisión humana completa. Antes de lanzar, conviene que una persona revise una muestra.
