---
paths:
  - "src/pages/**"
  - "src/layouts/**"
  - "src/components/**"
---

# Reglas de páginas

- Toda página usa `Base.astro` con `title`, `description` y `path` únicos.
- Exactamente un `<h1>` por página; los hooks `data-testid` de §6 no se renombran.
- Colores y espaciado vía tokens de `global.css`; sin hex sueltos.
- Sin JavaScript de cliente salvo Palabra del día y Compartir.
- `set:html` solo con `JSON.stringify` de datos propios, nunca con texto de una entrada.
