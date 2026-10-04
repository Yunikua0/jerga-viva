# Jerga Viva

Diccionario web estático de jerga moderna en español (redes sociales, Gen Z, gaming, relaciones).
Astro + Tailwind + Pagefind. Sin base de datos, sin cuentas, sin servidor.

## Comandos (desde la raíz, en bash)
| Tarea | Comando |
|---|---|
| Servidor de desarrollo | `npm run dev` |
| Tipos (Astro + TS) | `npm run check` |
| Lint | `npm run lint` |
| Formatear (Biome, solo .ts/.mjs) | `npm run format` |
| Tests unitarios | `npm test` |
| Build | `npm run build` |
| Auditoría de dist/ | `node scripts/check-dist.mjs` (`--full` tras el paso 9) |
| Tests e2e (usa dist/ ya construido) | `npm run test:e2e` |

## Cómo encaja todo
- `src/data/words.json` es la ÚNICA fuente de contenido. `src/content.config.ts` lo carga con el loader `file()` y lo valida con `src/lib/word-schema.ts`.
- Cada entrada genera `/palabra/<id>/`. Las categorías son el enum `CATEGORIES`.
- La búsqueda es el índice estático de Pagefind, creado por la integración `astro-pagefind` en `npm run build`.
- La "Palabra del día" se calcula en el navegador con `dayIndex(fecha UTC, total)`.

## Reglas
1. NO añadas nada de la tabla de Non-Goals del blueprint (usuarios, cuentas, imágenes OG, multi-idioma, CMS, anuncios).
2. Cada página tiene exactamente un `<h1>`, un `<title>` único y una meta descripción única.
3. `src/lib/*.ts` nunca importa `astro:content`.
4. Imports relativos SIN extensión en `.ts`; los `.astro` conservan la extensión.
5. Máximo 300 líneas por componente. Sin JavaScript de cliente salvo los scripts de Palabra del día y Compartir.
6. Los colores salen de los tokens CSS (`--primary`, `--bg`, …); nunca hex sueltos en componentes.
7. Termina cada paso con `npm run format` y su bloque Verify en verde antes del checkpoint (`git tag step-NN-slug`).
8. No inventes orígenes ni datos en las entradas: si no se sabe, "Origen incierto: …".
9. Nunca subas (`git push`) sin que el usuario lo pida.
