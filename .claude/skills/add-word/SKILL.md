---
name: add-word
description: Añade una palabra nueva al diccionario Jerga Viva. Úsalo cuando pidan añadir, crear o escribir una entrada, palabra o término nuevo en el diccionario.
---

# Añadir una palabra

## When to use
Cuando el usuario quiera una entrada nueva en `src/data/words.json`.

## Steps
1. Elige el `id` en minúsculas con guiones (`slugify(term) === id`) y la categoría de `CATEGORIES`.
2. Redacta la entrada con el contrato de §4 del blueprint: definición ≤ 220 caracteres, exactamente 2 ejemplos, origen verdadero ("Origen incierto: …" si no se sabe), `related` con 1–3 ids existentes, `sensitivity` correcta.
3. Añade el objeto a `src/data/words.json`.
4. Añade el `id` a la categoría correspondiente de `tests/fixtures/headwords.json` y ajusta la aserción "25 por categoría" de `tests/unit/coverage.test.ts`.
5. Ejecuta `npm run format`.

## Verify
```bash
npm test               # expect: exit 0, 0 failed
npm run build          # expect: exit 0
node scripts/check-dist.mjs   # expect: exit 0
```

## Do not
- No inventes etimologías, fechas ni creadores.
- No dejes `related` apuntando a ids que no existen.
