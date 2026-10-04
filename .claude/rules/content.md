---
paths:
  - "src/data/**"
  - "tests/fixtures/**"
---

# Reglas de contenido

- Cada entrada cumple `wordSchema` (`src/lib/word-schema.ts`); `slugify(term) === id`.
- Definición ≤ 220 caracteres, una oración; exactamente 2 ejemplos; origen verdadero o "Origen incierto: …".
- `related`: 1 a 3 ids de la lista de titulares, nunca el propio id.
- `reviewedAt` se omite hasta que una persona revise la entrada.
- Los titulares de `tests/fixtures/headwords.json` son 25 por categoría.
