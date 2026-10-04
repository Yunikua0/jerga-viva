# Jerga Viva — Blueprint

> Generado por The Architect el 2026-10-03
> Forma: marketing-site (variante directorio) · `knowledge/shapes/marketing-site.md`
> Runtime track: TypeScript / Node · `knowledge/runtime-tracks/ts-node.md`
> Modo de emisión: archivo único (11 pasos)
> Versión del blueprint: 1
> Versiones verificadas por última vez: 2026-10-03 — ver §11 para la procedencia de cada paquete

**Léelo primero.** Este blueprint se ejecuta desde una carpeta de proyecto vacía, con un shell tipo bash (en Windows, Git Bash). Todos los comandos asumen bash. "Jerga Viva" es un nombre **provisional**: vive en una sola constante (`SITE_NAME`, paso 1) y cambiarlo después es editar una línea.

---

## 1. Project Overview & Non-Goals

### Vision
Jerga Viva es un diccionario web gratuito de jerga moderna en español: la que se usa en redes sociales, en la cultura Gen Z, en videojuegos y en las relaciones. Cada palabra tiene su propia página con una definición corta, dos ejemplos de uso reales, su origen y palabras relacionadas. Está pensado para quien ve una palabra en un comentario o en un video, no la entiende y la busca en Google: la página tiene que responder en dos frases lo que significa.

No hay cuentas, comentarios ni envíos de usuarios. El contenido son 100 entradas redactadas con ayuda de IA y guardadas en un archivo del repositorio; añadir una palabra es añadir un objeto a un archivo JSON. El sitio es 100% estático: no hay servidor ni base de datos que mantener.

### Users
| Persona | What they come to do | Frequency |
|---|---|---|
| Persona que vio una palabra que no entiende (cualquier edad, llega desde Google) | Leer el significado de una palabra y salir | Una vez por palabra |
| Joven que quiere compartir o explicar una palabra | Abrir la palabra y compartir el enlace | Semanal |
| Curioso del lenguaje | Navegar por categoría o por la lista A–Z | Ocasional |

### Goals — v1 scope
1. El sitio tiene una página por palabra con definición, dos ejemplos, origen, categoría y palabras relacionadas.
2. El visitante puede encontrar una palabra por búsqueda instantánea, por la lista A–Z o por categoría.
3. La portada muestra una "Palabra del día" que cambia cada día sin reconstruir el sitio.
4. Cada palabra se puede compartir con el menú nativo del móvil o copiando el enlace.
5. Cada página es indexable: título y descripción únicos, canonical, sitemap, datos estructurados y `llms.txt`.
6. El sitio cumple WCAG 2.2 AA en claro y oscuro y funciona desde 360 px de ancho.

### Non-Goals — explicitly out of scope for v1

| Not building | Why not now | Revisit when |
|---|---|---|
| Palabras enviadas o votadas por usuarios | Exige cuentas, base de datos, moderación y anti-spam: es otro proyecto (~5× el trabajo) | El sitio supera 1.000 visitas diarias sostenidas y hay demanda real de contribuir |
| Cuentas de usuario, favoritos, historial | No hay datos privados que proteger en v1 | Se construya la contribución de usuarios |
| Imagen de vista previa (Open Graph) distinta por palabra | Requiere generación de imágenes y tipografías empaquetadas que no se pudieron probar en el diseño | Los enlaces compartidos en redes sean el canal principal de tráfico |
| Varios países, idiomas o variantes regionales | Cada región tiene jerga distinta; multiplica el contenido y el SEO | El contenido en español general esté completo y revisado |
| Publicidad, afiliados o monetización | No es un objetivo declarado del proyecto | Exista tráfico sostenido y una decisión explícita de monetizar |
| CMS o panel de administración | El contenido lo edita una persona en un archivo; un CMS es peso muerto | Editen el contenido personas no técnicas cada semana |
| Pipeline de CI en GitHub Actions | Las versiones de las acciones no se pudieron verificar en este diseño; la plataforma de hosting ya compila en cada cambio | Haya más de un colaborador |
| Audio de pronunciación, vídeos o imágenes por palabra | Peso, derechos y accesibilidad extra sin valor para el objetivo | Haya evidencia de que el usuario lo pide |

**El builder no debe implementar nada de esta tabla**, aunque parezca una adición pequeña. Si un paso parece requerirlo, es un defecto del blueprint: detente y repórtalo.

### Success metrics
| Metric | Target | How measured |
|---|---|---|
| Cada palabra de la lista de titulares tiene su página publicada | 100% de los titulares del Paso 5 | `node scripts/check-dist.mjs --full` termina con exit 0 |
| Páginas de palabras indexadas por Google | ≥ 80% 8 semanas después de enviar el sitemap | Informe "Páginas" de Google Search Console |
| Core Web Vitals en móvil | "Buenos" en portada y en una página de palabra, tras 28 días | Informe Core Web Vitals de Search Console |

---

## 2. Tech Stack

**Runtime track: TypeScript / Node.** Esta tabla nombra decisiones, no versiones. Toda versión vive en §11.

| Layer | Choice | Why this, over what |
|---|---|---|
| Language / runtime | TypeScript sobre Node LTS | La track por defecto; un solo lenguaje para sitio, tests y scripts. Rechazado: Python (no hay nada que lo justifique en un sitio estático) |
| Framework | Astro (static-first, islas) | Envía casi cero JavaScript por defecto, genera una página HTML por entrada y su colección de contenido valida el JSON en build. Rechazado: Next.js (carga de hidratación en un sitio que no tiene estado) |
| Styling | Tailwind CSS con tokens como variables CSS | El default de la track; los tokens como variables permiten modo oscuro con un solo bloque `@media`. Rechazado: CSS Modules (más nombres que inventar) |
| Component layer | Componentes `.astro` propios, sin librería | Son ~5 componentes sin interactividad compleja; una librería es peso. Rechazado: shadcn/Radix (requieren React) |
| Database | NOT APPLICABLE — el contenido es un archivo JSON versionado | Una base de datos añade servidor, migraciones y backups sin beneficio a 100 entradas |
| ORM / data access | Colección de contenido de Astro con el loader de archivo | Valida cada entrada con un esquema en build; un JSON inválido rompe el build, no la web |
| Auth | NOT APPLICABLE | No hay cuentas |
| Background work | NOT APPLICABLE | No hay trabajo en segundo plano; la "Palabra del día" se calcula en el navegador a partir de la fecha |
| Payments | NOT APPLICABLE | No hay cobros |
| File storage | NOT APPLICABLE | Sin archivos subidos |
| Search | Pagefind (índice estático generado en el build) vía `astro-pagefind` | Búsqueda instantánea sin servidor. Rechazado: Algolia/Meilisearch (necesitan un servicio o proceso aparte) |
| Email / notifications | NOT APPLICABLE | Sin formularios ni avisos |
| Hosting | Cloudflare Pages | CDN gratuito, previews por cambio y despliegue desde Git. Rechazado: Vercel (el sitio es estático; no necesita su runtime) |
| Package manager | npm (incluido con Node) | Un gestor menos que instalar y sin comportamientos nuevos sin probar. Rechazado: pnpm (la última major cambió el manejo de scripts de instalación y no se pudo probar en esta máquina) |

### Compatibility check
Verificado contra `knowledge/stack-compatibility.md` — ninguna de las filas de "known-bad" aplica: es la combinación probada "Content / marketing" (framework de islas + host CDN), no hay proveedor de identidad, ORM, proceso de larga duración, base de datos ni estado en memoria; Pagefind genera un índice estático y no un motor autoalojado que necesite proceso. La fila "linter que parsea CSS + motor CSS-first" no aplica porque Biome **no** procesa archivos `.css` en este proyecto (ver `biome.json`, §19.6).

---

## 3. Directory Structure

```
jerga-viva/
  .claude/                      # §19 — configuración de agente
    settings.json
    skills/add-word/SKILL.md
    skills/release-check/SKILL.md
    rules/content.md
    rules/astro-pages.md
  CLAUDE.md                     # §19.1
  AGENTS.md                     # §19.2
  README.md                     # paso 11
  package.json                  # §19.6 (lo emite el blueprint; npm install lo bloquea en package-lock.json)
  package-lock.json             # lo genera `npm install` en Bootstrap
  astro.config.mjs              # §19.6 (el paso 7 hace dos ediciones precisas)
  tsconfig.json                 # §19.6
  biome.json                    # §19.6
  vitest.config.ts              # §19.6
  playwright.config.ts          # §19.6
  .gitignore  .nvmrc  .env.example   # §19.6
  public/
    favicon.svg                 # §19.6
    _headers                    # paso 9 (cabeceras de Cloudflare Pages)
  scripts/
    check-dist.mjs              # paso 4 — auditoría de la carpeta dist/
  src/
    env.d.ts                    # paso 1
    content.config.ts           # paso 3 — define la colección "words"
    data/
      words.json                # pasos 3, 5, 6 — TODAS las entradas (único origen de verdad)
    lib/
      site.ts                   # paso 1 — nombre, lema, idioma, URL por defecto
      word-schema.ts            # paso 3 — esquema zod + categorías
      text.ts                   # paso 3 — slugify, letterOf, compareTerms, truncate, dayIndex
    styles/
      global.css                # pasos 1 y 2 — Tailwind + tokens
    layouts/
      Base.astro                # paso 2 — <head>, skip link, header, footer
    components/
      Header.astro              # paso 2
      Footer.astro              # paso 2
      WordCard.astro            # paso 4
      ShareButton.astro         # paso 8
    pages/
      index.astro               # pasos 1, 2 y 8
      palabra/[slug].astro      # paso 4
      categoria/[slug].astro    # paso 4
      a-z.astro                 # paso 4
      buscar.astro              # paso 7
      acerca.astro              # paso 9
      404.astro                 # paso 9
      llms.txt.ts               # paso 9
      robots.txt.ts             # paso 9
  tests/
    fixtures/headwords.json     # paso 5 — los 100 titulares por categoría
    unit/
      lib.test.ts               # paso 3
      coverage.test.ts          # paso 5
    e2e/
      smoke.spec.ts             # paso 1
      search.spec.ts            # paso 7
      home.spec.ts              # paso 8
      a11y.spec.ts              # paso 10
      responsive.spec.ts        # paso 10
      keyboard.spec.ts          # paso 10
  blueprints/jerga-viva-blueprint.md   # este archivo (excluido de todas las herramientas)
```

**Boundary rules**
- Todo el contenido de palabras vive en `src/data/words.json`. Ninguna página contiene texto de una palabra escrito a mano.
- Las páginas leen la colección con `getCollection("words")` de `astro:content`; nada más lee `words.json` en tiempo de build salvo `scripts/check-dist.mjs` y los tests (usan `node:fs`).
- `src/lib/*.ts` no importan nada de `astro:content` (así los tests unitarios los cargan en Node plano). Solo `src/content.config.ts` y los `.astro` lo hacen.
- Los componentes no hacen `fetch` ni usan JavaScript de cliente, salvo los dos `<script>` de los pasos 8 (Palabra del día y botón Compartir).
- Convención de resolución de módulos: ver "Resolution convention matrix" en §19.6 (una sola decisión, no se repite aquí).

**Origen de cada archivo.** Los archivos de configuración de la raíz, `public/favicon.svg`, `.claude/**`, `CLAUDE.md` y `AGENTS.md` los **emite este blueprint** en §19 y se escriben antes de Bootstrap (origen 2). Todo lo demás lo **autora el paso que lo nombra** (origen 1). `package-lock.json` y `node_modules/` los genera `npm install`.

---

## 4. Data Model

No hay base de datos. El modelo es una colección de contenido validada por un esquema.

### Entities

**Word** — una entrada del diccionario. Vive como un objeto del arreglo JSON `src/data/words.json`; su ciclo de vida es: se añade con una PR/commit, se edita en el mismo archivo, se borra eliminando el objeto.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | string | único; regex `^[a-z0-9]+(-[a-z0-9]+)*$` | Es el slug de la URL: `/palabra/<id>/`. Siempre cumple `slugify(term) === id` |
| `term` | string | 1–40 caracteres | La palabra tal como se muestra ("POV", "Main character") |
| `definition` | string | 20–220 caracteres | Una oración, español neutro; es también la meta descripción (truncada a 155) |
| `examples` | string[] | exactamente 2; cada uno 10–160 caracteres | Dos frases realistas de uso |
| `origin` | string | 20–300 caracteres | Origen o contexto. Si no se conoce con certeza: "Origen incierto…", nunca inventado |
| `category` | enum | `redes-sociales` · `gen-z` · `internet-gaming` · `relaciones-actitudes` | Determina la página de categoría |
| `related` | string[] | máximo 5 `id`; por defecto `[]` | Los enlaces se muestran solo si el id existe en la colección |
| `sensitivity` | enum | `none` · `mild` · `strong`; por defecto `none` | `mild` = se usa principalmente como insulto o burla; `strong` = vulgar o sexual |
| `reviewedAt` | string (AAAA-MM-DD) | opcional | Fecha de revisión humana; si está presente se muestra "Revisada el …". Ninguna entrada v1 la lleva |

**Category** — conjunto fijo de 4, no es un archivo: es el enum `CATEGORIES` de `src/lib/word-schema.ts` más sus etiquetas.

| id | Etiqueta mostrada |
|---|---|
| `redes-sociales` | Redes sociales |
| `gen-z` | Gen Z |
| `internet-gaming` | Internet y gaming |
| `relaciones-actitudes` | Relaciones y actitudes |

### Relationships
- `Word —(N:1)→ Category` (cada palabra tiene una categoría). Borrar una categoría del enum rompe el build mientras existan palabras que la usen: es intencional.
- `Word —(N:M)→ Word` mediante `related[]`, sin integridad referencial en el esquema; la integridad se comprueba en `tests/unit/coverage.test.ts` y las páginas ignoran ids inexistentes.

### Indexes
NOT APPLICABLE — no hay base de datos. La "búsqueda" es el índice de Pagefind generado en el build (paso 7).

### Schema
Este es el contenido completo de `src/lib/word-schema.ts` (lo autora el paso 3; se reproduce aquí porque es el contrato de todo el sitio):

```ts
import { z } from "astro/zod";

export const CATEGORIES = [
  "redes-sociales",
  "gen-z",
  "internet-gaming",
  "relaciones-actitudes",
] as const;

export const CATEGORY_LABELS: Record<(typeof CATEGORIES)[number], string> = {
  "redes-sociales": "Redes sociales",
  "gen-z": "Gen Z",
  "internet-gaming": "Internet y gaming",
  "relaciones-actitudes": "Relaciones y actitudes",
};

export const SENSITIVITY = ["none", "mild", "strong"] as const;

export const wordSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  term: z.string().min(1).max(40),
  definition: z.string().min(20).max(220),
  examples: z.array(z.string().min(10).max(160)).length(2),
  origin: z.string().min(20).max(300),
  category: z.enum(CATEGORIES),
  related: z.array(z.string()).max(5).default([]),
  sensitivity: z.enum(SENSITIVITY).default("none"),
  reviewedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export type Word = z.infer<typeof wordSchema>;
```

### Migrations
NOT APPLICABLE — no hay base de datos. Cambiar el esquema significa editar `word-schema.ts` y `words.json` en el mismo commit; el build valida todo.

### Seed data
`src/data/words.json` nace en el paso 3 con 4 entradas (una por categoría) y crece a 100 entre los pasos 5 y 6. No hay comando de seed: el archivo es el dato.

### Contract de redacción de entradas (lo usan los pasos 3, 5 y 6)

Quien escribe entradas (el builder) sigue estas reglas; son parte del contrato porque determinan la calidad del producto:

1. **Tono:** casual, claro y sin burlarse de quien usa la palabra. Español neutro (no regional); si algo es propio de un país, solo se menciona si se está seguro.
2. **Definición:** una sola oración, ≤ 220 caracteres, que explique el significado sin usar la propia palabra.
3. **Ejemplos:** exactamente 2, frases naturales en primera/segunda persona. No nombrar personas reales ni marcas como protagonistas.
4. **Origen:** etimología o contexto breve y verdadero. Si no se sabe con certeza se escribe "Origen incierto: …" con lo que sí se sabe. **Prohibido inventar** fechas, creadores o historias.
5. **`related`:** de 1 a 3 `id` tomados de la lista de titulares (paso 5). Nunca el propio `id`.
6. **`sensitivity`:** `mild` si el término se usa sobre todo como insulto o burla (por ejemplo `noob`, `hater`, `troll`, `simp`, `toxic`); `strong` si es vulgar o sexual (ninguno se espera en v1, pero si aparece se marca); si no, `none`.
7. **`term` derivado del `id`:** el `id` con guiones como espacios y la primera letra en mayúscula (`main-character` → "Main character"), salvo las siglas, que van en mayúsculas: `pov`, `fomo`, `gg`, `npc`, `afk`, `ez`, `op`, `fyp`. Siempre debe cumplirse `slugify(term) === id`.
8. **Sin datos de salud, legales ni consejos** presentados como hechos; términos de psicología popular (`gaslighting`, `love-bombing`) se definen como uso de internet, no como diagnóstico.
9. **`reviewedAt` se omite** en todas las entradas v1 (aún no hay revisión humana).

---

## 5. API Design

NOT APPLICABLE — el sitio es estático: no tiene API, endpoints de datos ni backend. Los únicos "endpoints" son archivos generados en el build (`/llms.txt`, `/robots.txt`, `/sitemap-index.xml`) y se describen en §6.

---

## 6. Frontend Architecture

### Routes
| Route | Page | Data source | Auth |
|---|---|---|---|
| `/` | Portada: héroe, Palabra del día, categorías | `getCollection("words")` en build + script de cliente para el día | public |
| `/palabra/<id>/` | Una palabra | Entrada de la colección | public |
| `/categoria/<id>/` | Lista de palabras de una categoría | Colección filtrada | public |
| `/a-z/` | Índice alfabético | Colección ordenada | public |
| `/buscar/` | Búsqueda | Índice Pagefind generado en build | public |
| `/acerca/` | Acerca del diccionario y política de contenido | Estática | public |
| `/404.html` (ruta `404.astro`) | Página no encontrada | Estática | public |
| `/llms.txt`, `/robots.txt` | Archivos para rastreadores | Endpoints estáticos | public |
| `/sitemap-index.xml`, `/sitemap-0.xml` | Sitemap | Integración de sitemap | public |

### Rendering strategy
**Todo es estático** (`output` por defecto de Astro, sin adaptador). Se genera un HTML por ruta en `npm run build`. `trailingSlash: "always"` en `astro.config.mjs`: toda URL canónica termina en `/`. La única parte dinámica es la "Palabra del día", que se resuelve en el navegador con la fecha (ver paso 8); sin JavaScript se ve la palabra elegida en el build.

### Component hierarchy
```
Base.astro (head, skip link, <Header/>, <main id="main">, <Footer/>)
├─ index.astro        → héroe · sección Palabra del día · 4 enlaces de categoría
├─ palabra/[slug]     → <article data-pagefind-body>: h1, chip de categoría, definición,
│                        ejemplos, origen, <ShareButton/> (paso 8), relacionadas
├─ categoria/[slug]   → h1 + lista de <WordCard/>
├─ a-z                → navegación de letras + secciones por letra con <WordCard/>
├─ buscar             → <Search/> de astro-pagefind
├─ acerca / 404       → texto estático
```
Servidor vs cliente: **no hay componentes de framework**. Los únicos scripts de cliente son los de Palabra del día (en `index.astro`) y Compartir (`ShareButton.astro`).

### Hooks de prueba (contrato literal — los tests dependen de esto)
| Elemento | Marcado exacto |
|---|---|
| Skip link (primer enlace del `<body>`) | `<a class="skip-link" href="#main">Saltar al contenido</a>` |
| Contenido principal | `<main id="main" tabindex="-1">` (lo pone `Base.astro`) |
| Navegación principal | `<nav aria-label="Principal">` con enlaces de texto: "Inicio" `/`, "A–Z" `/a-z/`, "Buscar" `/buscar/`, "Acerca" `/acerca/` |
| Definición en página de palabra | `<p data-testid="definition">` |
| Ejemplos | `<ul data-testid="examples">` con exactamente 2 `<li>` |
| Botón compartir | `<button type="button" data-share ...>Compartir</button>` y, al lado, `<p role="status" data-share-status></p>` |
| Palabra del día (sección) | `<section aria-labelledby="daily-title" data-daily>` con `<h2 id="daily-title">Palabra del día</h2>` y un enlace `<a data-daily-link>` |
| Títulos | exactamente un `<h1>` por página |

### State management
NOT APPLICABLE — no hay estado de aplicación. Estado de cliente efímero: nada se persiste (ni `localStorage` ni cookies).

### Loading, empty, and error states
- **Búsqueda sin resultados:** la UI de Pagefind muestra su texto de "sin resultados"; no se personaliza.
- **Categoría sin palabras:** imposible en v1 (todas tienen 25), pero la página muestra "Todavía no hay palabras aquí." si la lista está vacía.
- **Palabra del día sin JavaScript:** se ve la palabra elegida en el build (servidor); con JavaScript se reemplaza por la del día actual.
- **Ruta inexistente:** `404.astro` con h1 "Esa palabra no existe (todavía)" y enlaces a Inicio y Buscar.

---

## 7. Design System

Dirección elegida por el arquitecto (el usuario delegó): **juvenil, limpio y colorido** — fondo crema cálido, violeta eléctrico como color de marca, rosa solo como acento decorativo. Tarjetas redondeadas con borde visible. Mobile-first.

### Colors
Los valores se aplican como variables CSS en `src/styles/global.css` (paso 2).

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--primary` | `#5B2EFF` | `#A892FF` | Enlaces, botones, anillo de foco |
| `--primary-fg` | `#FFFFFF` | `#14101F` | Texto sobre `--primary` |
| `--bg` | `#FFFBF5` | `#14101F` | Fondo de página |
| `--surface` | `#FFFFFF` | `#1E1830` | Tarjetas |
| `--border` | `#8B819E` | `#7A6F94` | Bordes de tarjetas, inputs y separadores de UI |
| `--fg` | `#1A1423` | `#F5F0FF` | Texto de cuerpo |
| `--fg-muted` | `#5E5670` | `#B8AECF` | Texto secundario |
| `--accent` | `#FF4D8D` | `#FF6FA5` | **Solo decorativo** (subrayados, formas). Nunca texto ni único indicador |
| `--destructive` | `#C4162A` | `#FF7B8A` | Etiqueta de lenguaje fuerte |
| `--success` | `#0B7A3E` | `#4ADE80` | Mensaje "Enlace copiado" |

**Contraste** (calculado a mano con la luminancia relativa de WCAG; axe lo verifica en el paso 10): `--fg` sobre `--bg` ≈ 17,5:1 (claro) y ≈ 16:1 (oscuro); `--primary` sobre `--bg` ≈ 6,3:1 (claro) y ≈ 7,2:1 (oscuro); `--border` sobre `--bg` ≈ 3,6:1 (claro) y ≈ 4,0:1 (oscuro). Todos superan 4,5:1 para texto y 3:1 para límites de componentes. Si axe reporta un par fallido en el paso 10, se corrige el hex aquí y en `global.css`, no se ignora.

### Typography
| Role | Family | Size / line-height | Weight | Tracking |
|---|---|---|---|---|
| Display (h1) | `ui-rounded, "Arial Rounded MT Bold", system-ui, sans-serif` | `clamp(2rem, 6vw, 3.25rem)` / 1.1 | 800 | -0.02em |
| Heading (h2/h3) | misma familia display | h2 `1.5rem`/1.2, h3 `1.25rem`/1.3 | 700 | -0.01em |
| Body | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` | `1.0625rem` / 1.65 | 400 | normal |
| Mono | NOT USED | — | — | — |

**Font loading:** NO se cargan fuentes: se usan las del sistema (cero peticiones y cero CLS). `font-display` no aplica. Limitación aceptada: la apariencia varía por sistema operativo. Cambiar a una fuente propia es una mejora de v2.

### Spacing, radius, elevation
- Escala de espacio: base 4 px → 4, 8, 12, 16, 24, 32, 48, 64 px (clases `1,2,3,4,6,8,12,16` de Tailwind).
- Radio: tarjetas 16 px (`rounded-2xl`), botones 999 px (`rounded-full`), inputs 12 px (`rounded-xl`).
- Sombra de tarjeta, claro: `0 1px 2px rgb(26 20 35 / 0.08), 0 8px 24px rgb(91 46 255 / 0.10)`; oscuro: `0 1px 2px rgb(0 0 0 / 0.4)`.
- Ancho máximo del contenido: `68rem`; columna de lectura en página de palabra: `40rem`. Breakpoints: los de Tailwind (`sm` 40rem, `md` 48rem, `lg` 64rem).

### Motion
Transiciones de color y de `transform` de 150 ms con `ease-out` en enlaces, botones y tarjetas. Nada se anima solo. Todo se desactiva con `@media (prefers-reduced-motion: reduce)` (bloque literal en `global.css`).

### Component style
Piensa en una libreta de pegatinas: tarjetas blancas (o violeta muy oscuro en modo oscuro) con borde de 2 px en `--border`, títulos gruesos y redondeados, un subrayado rosa decorativo bajo el h1 de la portada, y "chips" redondeados para categorías. Un componente nuevo pertenece si es plano, redondeado y tiene un único color de énfasis (`--primary`). No se usan degradados ni imágenes.

---

## 8. Authentication & Authorization

NOT APPLICABLE — el sitio no tiene cuentas ni contenido privado.

---

## 9. BUILD ORDER

Todos los comandos se ejecutan desde la raíz del proyecto (`jerga-viva/`), en bash. **Cada paso termina con `npm run format`** (aplica el formateo de Biome a los archivos nuevos) antes de su `Verify`; los pasos que crean archivos `.ts`/`.mjs` lo necesitan o `npm run lint` fallará.

### Step map

| # | Step | Depends on | Touches | Gate |
|---|---|---|---|---|
| 1 | Proyecto base que compila y se sirve | Bootstrap (§10) | `src/env.d.ts`, `src/lib/site.ts`, `src/styles/global.css`, `src/pages/index.astro`, `tests/e2e/smoke.spec.ts` | `npm run build` y el test de humo sirven `/` con 200 |
| 2 | Sistema de diseño y layout base | 1 | `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/pages/index.astro` | `dist/index.html` con `lang`, canonical, skip link y tokens |
| 3 | Modelo de contenido y utilidades | 2 | `src/lib/word-schema.ts`, `src/lib/text.ts`, `src/content.config.ts`, `src/data/words.json`, `tests/unit/lib.test.ts` | `npm test` verde y build valida el JSON |
| 4 | Páginas de palabra, categoría y A–Z + auditoría de dist | 3 | `src/components/WordCard.astro`, `src/pages/palabra/[slug].astro`, `src/pages/categoria/[slug].astro`, `src/pages/a-z.astro`, `scripts/check-dist.mjs` | `node scripts/check-dist.mjs` exit 0 |
| 5 | Contenido, lote 1 (Redes sociales y Gen Z) | 4 | `src/data/words.json`, `tests/fixtures/headwords.json`, `tests/unit/coverage.test.ts` | cobertura de 2 categorías |
| 6 | Contenido, lote 2 (Internet y gaming; Relaciones y actitudes) | 5 | `src/data/words.json` | cobertura de las 4 categorías |
| 7 | Búsqueda | 6 | `astro.config.mjs`, `src/pages/buscar.astro`, `tests/e2e/search.spec.ts` | test e2e de búsqueda |
| 8 | Portada, Palabra del día y Compartir | 7 | `src/pages/index.astro`, `src/components/ShareButton.astro`, `src/pages/palabra/[slug].astro`, `tests/e2e/home.spec.ts` | e2e de portada y compartir |
| 9 | SEO, `llms.txt`, páginas legales y cabeceras | 8 | `src/pages/llms.txt.ts`, `src/pages/robots.txt.ts`, `src/pages/acerca.astro`, `src/pages/404.astro`, `public/_headers` | `check-dist --full` exit 0 |
| 10 | Accesibilidad, responsive y teclado | 9 | `tests/e2e/a11y.spec.ts`, `tests/e2e/responsive.spec.ts`, `tests/e2e/keyboard.spec.ts` | e2e verde |
| 11 | README y compuerta final | 10 | `README.md` | compuerta global §20.1 |

---

#### Step 1 — Proyecto base que compila y se sirve

**Do**
Los archivos de configuración ya existen (los escribiste antes de Bootstrap desde §19.6). Crea:
- `src/env.d.ts` con exactamente una línea: `/// <reference path="../.astro/types.d.ts" />`
- `src/lib/site.ts`:
  ```ts
  export const SITE_NAME = "Jerga Viva";
  export const SITE_TAGLINE = "El diccionario de la jerga moderna en español";
  export const SITE_LANG = "es";
  export const SITE_FALLBACK_URL = "https://jerga-viva.pages.dev";
  ```
- `src/styles/global.css` con exactamente `@import "tailwindcss";`
- `src/pages/index.astro` (marcador de posición que el paso 2 reemplaza):
  ```astro
  ---
  import "../styles/global.css";
  ---
  <html lang="es">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Jerga Viva</title>
    </head>
    <body>
      <h1>Jerga Viva</h1>
    </body>
  </html>
  ```
- `tests/e2e/smoke.spec.ts`:
  ```ts
  import { expect, test } from "@playwright/test";

  test("home responds 200 and has exactly one h1", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("unknown path responds 404", async ({ page }) => {
    const response = await page.goto("/no-such-page/");
    expect(response?.status()).toBe(404);
  });
  ```
Luego ejecuta `npm run format`.

**Done when**
- [ ] WHEN `npm run build` runs THE SYSTEM SHALL exit 0 and write `dist/index.html`.
- [ ] WHEN `npm run check` runs THE SYSTEM SHALL exit 0.
- [ ] WHEN `npm run lint` runs THE SYSTEM SHALL exit 0 with no diagnostics.
- [ ] WHEN Playwright requests `/` from the preview server THE SYSTEM SHALL receive HTTP 200 and exactly one `h1`.
- [ ] WHEN Playwright requests `/no-such-page/` THE SYSTEM SHALL receive HTTP 404.

**Verify**
```bash
npm run format                                   # expect: exit 0
npm run check                                    # expect: exit 0
npm run lint                                     # expect: exit 0
npm run build                                    # expect: exit 0
test -f dist/index.html                          # expect: exit 0
npx playwright test tests/e2e/smoke.spec.ts      # expect: exit 0, 0 failed (sirve dist con astro preview y pide / y /no-such-page/)
```

**Checkpoint**
```bash
git add -A && git commit -m "step 1: base project builds and serves"
git tag step-01-base
# rollback target if step 2 goes wrong: git reset --hard step-01-base
```

---

#### Step 2 — Sistema de diseño y layout base

**Do**
1. Reemplaza `src/styles/global.css` por este contenido exacto (tokens de §7; Tailwind v4 se configura en CSS, no hay `tailwind.config.js`):
   ```css
   @import "tailwindcss";

   :root {
     --bg: #fffbf5;
     --surface: #ffffff;
     --fg: #1a1423;
     --fg-muted: #5e5670;
     --border: #8b819e;
     --primary: #5b2eff;
     --primary-fg: #ffffff;
     --accent: #ff4d8d;
     --destructive: #c4162a;
     --success: #0b7a3e;
     --shadow-card: 0 1px 2px rgb(26 20 35 / 0.08), 0 8px 24px rgb(91 46 255 / 0.1);
   }

   @media (prefers-color-scheme: dark) {
     :root {
       --bg: #14101f;
       --surface: #1e1830;
       --fg: #f5f0ff;
       --fg-muted: #b8aecf;
       --border: #7a6f94;
       --primary: #a892ff;
       --primary-fg: #14101f;
       --accent: #ff6fa5;
       --destructive: #ff7b8a;
       --success: #4ade80;
       --shadow-card: 0 1px 2px rgb(0 0 0 / 0.4);
     }
   }

   @theme inline {
     --color-bg: var(--bg);
     --color-surface: var(--surface);
     --color-fg: var(--fg);
     --color-fg-muted: var(--fg-muted);
     --color-border: var(--border);
     --color-primary: var(--primary);
     --color-primary-fg: var(--primary-fg);
     --color-accent: var(--accent);
     --color-destructive: var(--destructive);
     --color-success: var(--success);
     --font-display: ui-rounded, "Arial Rounded MT Bold", system-ui, sans-serif;
     --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
   }

   @layer base {
     html {
       color-scheme: light dark;
     }
     body {
       background: var(--bg);
       color: var(--fg);
       font-family: var(--font-sans);
       font-size: 1.0625rem;
       line-height: 1.65;
     }
     h1 {
       font-family: var(--font-display);
       font-weight: 800;
       font-size: clamp(2rem, 6vw, 3.25rem);
       line-height: 1.1;
       letter-spacing: -0.02em;
     }
     h2 {
       font-family: var(--font-display);
       font-weight: 700;
       font-size: 1.5rem;
       line-height: 1.2;
       letter-spacing: -0.01em;
     }
     h3 {
       font-family: var(--font-display);
       font-weight: 700;
       font-size: 1.25rem;
       line-height: 1.3;
     }
     a {
       color: var(--primary);
       text-underline-offset: 3px;
     }
     :focus-visible {
       outline: 3px solid var(--primary);
       outline-offset: 3px;
     }
     main:focus {
       outline: none;
     }
   }

   .skip-link {
     position: absolute;
     left: 1rem;
     top: -4rem;
     z-index: 50;
     padding: 0.75rem 1rem;
     border-radius: 999px;
     background: var(--primary);
     color: var(--primary-fg);
   }
   .skip-link:focus {
     top: 1rem;
   }

   @media (prefers-reduced-motion: reduce) {
     *,
     *::before,
     *::after {
       transition: none !important;
       animation: none !important;
     }
   }
   ```
2. `src/layouts/Base.astro` — props `title: string`, `description: string`, `path: string`, `noindex?: boolean`, `jsonLd?: Record<string, unknown>`, `ogType?: "website" | "article"` (por defecto `"website"`). Frontmatter: importa `../styles/global.css`, `Header`, `Footer`, `SITE_NAME`, `SITE_LANG`, `SITE_FALLBACK_URL` de `../lib/site`; calcula `const canonical = new URL(path, Astro.site ?? SITE_FALLBACK_URL).href;`. El `<head>` contiene, en este orden: `<meta charset="utf-8" />`, viewport `width=device-width, initial-scale=1`, `<title>{title}</title>`, `<meta name="description" content={description} />`, `<link rel="canonical" href={canonical} />`, `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`, `<meta name="color-scheme" content="light dark" />`, `<meta name="robots" content="noindex" />` solo si `noindex`, `og:site_name`, `og:title`, `og:description`, `og:url` (=canonical), `og:type`, `<meta name="twitter:card" content="summary" />`, y el `<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />` solo si `jsonLd`. El `<html>` lleva `lang={SITE_LANG}`. El `<body>` contiene, en este orden: el skip link literal de §6, `<Header />`, `<main id="main" tabindex="-1" class="mx-auto w-full max-w-[68rem] px-4 py-8 sm:px-6"><slot /></main>`, `<Footer />`. El `<body>` lleva `class="min-h-dvh flex flex-col"` y el `<main>` `flex-1`.
3. `src/components/Header.astro`: marca "Jerga Viva" como enlace a `/` y `<nav aria-label="Principal">` con los cuatro enlaces de §6, en una fila que hace wrap en 360 px, cada enlace con área táctil ≥ 24×24 px (usa `inline-flex min-h-11 items-center px-3`).
4. `src/components/Footer.astro`: texto `Jerga Viva · Diccionario en construcción` y un enlace "Acerca del diccionario" a `/acerca/`.
5. Reescribe `src/pages/index.astro` para usar `Base` con `title="Jerga Viva — diccionario de jerga moderna en español"`, `description="Significado, ejemplos y origen de la jerga moderna en español: redes sociales, Gen Z, gaming y relaciones."`, `path="/"`, y como contenido solo `<h1>Jerga Viva</h1>` (el paso 8 lo completa).
Luego `npm run format`.

**Done when**
- [ ] WHEN `dist/index.html` is read THE SYSTEM SHALL contain `<html lang="es"`, exactly one `<title>` and one `rel="canonical"` link.
- [ ] WHEN `dist/index.html` is read THE SYSTEM SHALL have an `<a>` with `href="#main"` as the first link after `<body>`.
- [ ] WHEN the built output is searched THE SYSTEM SHALL contain the light primary color (`5b2eff`, case-insensitive) and a `prefers-color-scheme` media rule.
- [ ] WHEN `npm run build` runs THE SYSTEM SHALL exit 0 (typecheck y lint también).

**Verify**
```bash
npm run format                                                        # expect: exit 0
npm run check                                                         # expect: exit 0
npm run lint                                                          # expect: exit 0
npm run build                                                         # expect: exit 0
grep -q '<html lang="es"' dist/index.html                             # expect: exit 0
grep -q 'rel="canonical"' dist/index.html                             # expect: exit 0
node -e 'const h=require("node:fs").readFileSync("dist/index.html","utf8");const i=h.indexOf("<body");const a=h.indexOf("<a",i);if(!/^<a[^>]*href=["\x27]?#main/.test(h.slice(a,a+160)))process.exit(1)'   # expect: exit 0 (el skip link es el primer enlace)
grep -rqi '5b2eff' dist                                               # expect: exit 0
grep -rq 'prefers-color-scheme' dist                                  # expect: exit 0
npx playwright test tests/e2e/smoke.spec.ts                           # expect: exit 0, 0 failed
```

**Checkpoint**
```bash
git add -A && git commit -m "step 2: design tokens and base layout"
git tag step-02-design
# rollback target if step 3 goes wrong: git reset --hard step-02-design
```

---

#### Step 3 — Modelo de contenido y utilidades

**Do**
1. `src/lib/word-schema.ts`: copia exactamente el bloque de §4 "Schema".
2. `src/lib/text.ts`:
   ```ts
   export function slugify(input: string): string {
     return input
       .normalize("NFD")
       .replace(/[\u0300-\u036f]/g, "")
       .toLowerCase()
       .replace(/[^a-z0-9]+/g, "-")
       .replace(/^-+|-+$/g, "");
   }

   export function letterOf(term: string): string {
     const first = term
       .normalize("NFD")
       .replace(/[\u0300-\u036f]/g, "")
       .charAt(0)
       .toUpperCase();
     return /^[A-Z]$/.test(first) ? first : "#";
   }

   export function compareTerms(a: string, b: string): number {
     return a.localeCompare(b, "es", { sensitivity: "base" });
   }

   export function truncate(text: string, max: number): string {
     if (text.length <= max) return text;
     return `${text.slice(0, max - 1).trimEnd()}…`;
   }

   export function dayIndex(date: Date, length: number): number {
     const days = Math.floor(
       Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86400000,
     );
     return ((days % length) + length) % length;
   }
   ```
3. `src/content.config.ts`:
   ```ts
   import { defineCollection } from "astro:content";
   import { file } from "astro/loaders";
   import { wordSchema } from "./lib/word-schema";

   const words = defineCollection({
     loader: file("src/data/words.json"),
     schema: wordSchema,
   });

   export const collections = { words };
   ```
4. `src/data/words.json` con **exactamente** estas 4 entradas (una por categoría; son también el modelo de calidad para los pasos 5 y 6):
   ```json
   [
     {
       "id": "viral",
       "term": "Viral",
       "definition": "Contenido que se comparte tan rápido en redes que lo ve muchísima gente en poco tiempo.",
       "examples": [
         "Ese video del perro bailando se hizo viral en una sola noche.",
         "Su tuit se volvió viral y ahora todo el mundo lo cita."
       ],
       "origin": "Viene de «virus»: la idea es que el contenido se contagia de una persona a otra, igual que un virus, pero a través de las redes sociales.",
       "category": "redes-sociales",
       "related": ["meme", "trending"],
       "sensitivity": "none"
     },
     {
       "id": "cringe",
       "term": "Cringe",
       "definition": "Algo que da vergüenza ajena o resulta incómodo de ver o escuchar.",
       "examples": [
         "Ese baile en la oficina fue tan cringe que me tapé la cara.",
         "No subas ese video, da cringe."
       ],
       "origin": "Del inglés «cringe», que significa encogerse de vergüenza. Se popularizó en foros y redes entre jóvenes hispanohablantes y hoy se usa tal cual.",
       "category": "gen-z",
       "related": ["random", "vibe"],
       "sensitivity": "none"
     },
     {
       "id": "noob",
       "term": "Noob",
       "definition": "Jugador novato o con poca experiencia, dicho a veces con burla y a veces con cariño.",
       "examples": [
         "No te enojes con el noob del equipo, apenas empezó a jugar.",
         "Fui un noob total en mis primeras partidas."
       ],
       "origin": "Del inglés «newbie» (novato), acortado en los foros de videojuegos. Nació como insulto, aunque muchos lo dicen de sí mismos sin problema.",
       "category": "internet-gaming",
       "related": ["tryhard", "gg"],
       "sensitivity": "mild"
     },
     {
       "id": "crush",
       "term": "Crush",
       "definition": "Persona que te gusta en secreto o con la que sueñas, aunque todavía no haya nada entre ustedes.",
       "examples": [
         "Mi crush me dio like a la foto y no puedo dejar de sonreír.",
         "Tengo un crush con alguien de mi clase."
       ],
       "origin": "Del inglés «crush» (enamoramiento). Entró al español por la música pop y las series juveniles, y hoy se usa como sustantivo: «mi crush».",
       "category": "relaciones-actitudes",
       "related": ["ghosting", "red-flag"],
       "sensitivity": "none"
     }
   ]
   ```
5. `tests/unit/lib.test.ts` (importa de `../../src/lib/text` y `../../src/lib/word-schema`, sin extensión) con estas aserciones, cada una un `it`:
   - `slugify("Main character")` es `"main-character"`; `slugify("Cancelar")` es `"cancelar"`; `slugify("¡Está bueno!")` es `"esta-bueno"`; `slugify("POV")` es `"pov"`.
   - `letterOf("POV")` es `"P"`; `letterOf("Álgebra")` es `"A"`; `letterOf("123")` es `"#"`.
   - `truncate("hola", 10)` es `"hola"`; el resultado de `truncate` con un texto de 300 caracteres y `max` 155 tiene longitud ≤ 155 y termina en `"…"`.
   - `dayIndex` (función de `text.ts`, ver abajo): el resultado siempre está en `[0, length)`; dos instantes del mismo día UTC (`2026-01-01T00:00:00Z` y `2026-01-01T23:59:59Z`) dan el mismo índice; y para dos días consecutivos `d1`, `d2` con `length` 100 se cumple `(dayIndex(d1, 100) + 1) % 100 === dayIndex(d2, 100)`.
   - `wordSchema.parse` acepta la entrada `viral` literal del punto 4 (cópiala en el test).
   - `wordSchema.safeParse` rechaza una entrada con un solo ejemplo (`success` es `false`) y otra con `id: "Viral"` (`success` es `false`).
   - Para cada objeto de `src/data/words.json` (leído con `node:fs`), `wordSchema.safeParse(w).success` es `true` y `slugify(w.term) === w.id`.
Luego `npm run format`.

**Done when**
- [ ] WHEN `npm test` runs THE SYSTEM SHALL exit 0 with 0 failed and 0 skipped.
- [ ] WHEN `npm run build` runs THE SYSTEM SHALL exit 0, which validates every entry of `words.json` against the schema.
- [ ] WHEN an entry has one example instead of two THE SYSTEM SHALL fail schema validation (cubierto por el test del esquema).
- [ ] WHEN `npm run check` and `npm run lint` run THE SYSTEM SHALL exit 0.

**Verify**
```bash
npm run format                  # expect: exit 0
npm run check                   # expect: exit 0
npm run lint                    # expect: exit 0
npm test                        # expect: exit 0, 0 failed, 0 skipped
npm run build                   # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 3: content model, utilities and seed entries"
git tag step-03-content-model
# rollback target if step 4 goes wrong: git reset --hard step-03-content-model
```

---

#### Step 4 — Páginas de palabra, categoría y A–Z + auditoría de dist

**Do**
Todas las páginas usan `Base` y obtienen datos con `getCollection("words")` de `astro:content`. Los títulos y descripciones son literales de esta tabla (únicos por página):

| Página | `title` | `description` | `path` |
|---|---|---|---|
| Palabra | `` `${term}: significado y ejemplos \| Jerga Viva` `` (el separador es una barra vertical `\|` literal) | `truncate(definition, 155)` | `` `/palabra/${id}/` `` |
| Categoría | `` `${label}: jerga y palabras \| Jerga Viva` `` | `` `Palabras de ${label} explicadas con ejemplos: significado y origen de cada término.` `` | `` `/categoria/${categoryId}/` `` |
| A–Z | `Diccionario A–Z \| Jerga Viva` | `Todas las palabras de Jerga Viva ordenadas alfabéticamente.` | `/a-z/` |

1. `src/components/WordCard.astro` — props `id`, `term`, `definition`, `sensitivity`. Una tarjeta (`<article>` con `rounded-2xl border-2 border-border bg-surface p-4`, sombra `shadow-[var(--shadow-card)]`) con el término como enlace `<a href={`/palabra/${id}/`}>` dentro de un `<h3>`, la definición, y, si `sensitivity !== "none"`, una etiqueta de texto: "Uso ofensivo leve" (`mild`) o "Lenguaje fuerte" (`strong`, color `text-destructive`).
2. `src/pages/palabra/[slug].astro` — `getStaticPaths` devuelve una ruta por entrada (`params: { slug: entry.id }`, `props: { entry }`). Contenido dentro de `<article data-pagefind-body class="mx-auto max-w-[40rem]">`: `<h1>` con el término; un chip de categoría enlazado a `/categoria/<categoría>/`; si `sensitivity !== "none"` la etiqueta de texto anterior; `<p data-testid="definition">`; `<h2>Ejemplos</h2>` y `<ul data-testid="examples">` con 2 `<li>`; `<h2 id="origen">Origen</h2>` y el texto; si `reviewedAt` existe, `<p>Revisada el {reviewedAt}</p>`; y, si al menos un id de `related` existe en la colección, `<h2>Palabras relacionadas</h2>` con enlaces solo a los ids existentes. Pasa a `Base` el `jsonLd`:
   ```ts
   {
     "@context": "https://schema.org",
     "@type": "DefinedTerm",
     name: entry.data.term,
     description: entry.data.definition,
     url: canonicalUrl,
     inDefinedTermSet: { "@type": "DefinedTermSet", name: SITE_NAME, url: siteUrl },
   }
   ```
   donde `siteUrl` es `new URL("/", Astro.site ?? SITE_FALLBACK_URL).href` y `canonicalUrl` es `new URL(`/palabra/${entry.id}/`, Astro.site ?? SITE_FALLBACK_URL).href`.
3. `src/pages/categoria/[slug].astro` — una ruta por cada valor de `CATEGORIES`; `<h1>` con la etiqueta de `CATEGORY_LABELS`; lista (`<ul>`) de `WordCard` ordenada con `compareTerms` sobre `term`; si no hay palabras, el texto "Todavía no hay palabras aquí.".
4. `src/pages/a-z.astro` — `<h1>Diccionario A–Z</h1>`; `<nav aria-label="Letras">` con un enlace `#letra-X` por cada letra que tenga palabras (incluye `#` si aplica); luego, por letra, `<h2 id="letra-X">X</h2>` y sus `WordCard`, orden por `compareTerms`; la letra se obtiene con `letterOf`.
5. `scripts/check-dist.mjs` — auditoría de `dist/` (código completo, sin imports del proyecto; el paso 9 y 11 la ejecutan con `--full`):
   ```js
   import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
   import { join } from "node:path";

   const DIST = "dist";
   const FULL = process.argv.includes("--full");
   const failures = [];
   const fail = (message) => failures.push(message);
   const norm = (p) => p.split("\\").join("/");

   if (!existsSync(DIST)) {
     console.error("dist/ not found. Run `npm run build` first.");
     process.exit(2);
   }

   function walk(dir) {
     return readdirSync(dir).flatMap((name) => {
       const path = join(dir, name);
       return statSync(path).isDirectory() ? walk(path) : [path];
     });
   }

   const files = walk(DIST).map(norm);
   const pages = files.filter((f) => f.endsWith(".html") && !f.startsWith(`${DIST}/pagefind/`));
   const words = JSON.parse(readFileSync("src/data/words.json", "utf8"));
   const ids = words.map((w) => w.id);
   const categories = [...new Set(words.map((w) => w.category))];

   const titles = new Map();
   const descriptions = new Map();

   for (const page of pages) {
     const html = readFileSync(page, "utf8");
     const is404 = page.endsWith("/404.html");
     if (!/<html[^>]*lang=["']?es/.test(html)) fail(`${page}: missing lang="es"`);
     const titleMatches = html.match(/<title>[^<]+<\/title>/g) ?? [];
     if (titleMatches.length !== 1) fail(`${page}: expected exactly one <title>, found ${titleMatches.length}`);
     else if (titles.has(titleMatches[0])) fail(`${page}: duplicate title also used by ${titles.get(titleMatches[0])}`);
     else titles.set(titleMatches[0], page);
     const h1Matches = html.match(/<h1[\s>]/g) ?? [];
     if (h1Matches.length !== 1) fail(`${page}: expected exactly one <h1>, found ${h1Matches.length}`);
     const description = html.match(/<meta[^>]*name=["']?description["']?[^>]*content="([^"]*)"/);
     if (!description) fail(`${page}: missing meta description`);
     else if (descriptions.has(description[1])) fail(`${page}: duplicate description also used by ${descriptions.get(description[1])}`);
     else descriptions.set(description[1], page);
     if (!is404 && !/<link[^>]*rel=["']?canonical["']?/.test(html)) fail(`${page}: missing canonical link`);
   }

   for (const id of ids) {
     const page = `${DIST}/palabra/${id}/index.html`;
     if (!existsSync(page)) {
       fail(`missing word page for "${id}"`);
       continue;
     }
     const html = readFileSync(page, "utf8");
     if (!html.includes('data-testid="definition"')) fail(`${page}: missing definition hook`);
     const ld = html.match(/<script type="application\/ld\+json">([^<]*)<\/script>/);
     if (!ld) fail(`${page}: missing JSON-LD`);
     else {
       try {
         if (JSON.parse(ld[1])["@type"] !== "DefinedTerm") fail(`${page}: JSON-LD @type is not DefinedTerm`);
       } catch {
         fail(`${page}: JSON-LD is not valid JSON`);
       }
     }
   }
   const wordDirs = files.filter((f) => /^dist\/palabra\/[^/]+\/index\.html$/.test(f)).map((f) => f.split("/")[2]);
   for (const dir of wordDirs) if (!ids.includes(dir)) fail(`unexpected word page "${dir}"`);

   // Every internal word link on every page must point to a page that exists.
   for (const page of pages) {
     const html = readFileSync(page, "utf8");
     for (const match of html.matchAll(/href=["']\/palabra\/([a-z0-9-]+)\/["']/g)) {
       if (!ids.includes(match[1])) fail(`${page}: links to a word page that does not exist: ${match[1]}`);
     }
   }

   for (const category of categories) {
     if (!existsSync(`${DIST}/categoria/${category}/index.html`)) fail(`missing category page "${category}"`);
   }
   if (!existsSync(`${DIST}/a-z/index.html`)) fail("missing /a-z/ page");

   if (FULL) {
     for (const required of ["sitemap-index.xml", "sitemap-0.xml", "robots.txt", "llms.txt", "404.html", "_headers"]) {
       if (!existsSync(`${DIST}/${required}`)) fail(`missing ${required}`);
     }
     if (existsSync(`${DIST}/sitemap-0.xml`)) {
       const sitemap = readFileSync(`${DIST}/sitemap-0.xml`, "utf8");
       for (const id of ids) if (!sitemap.includes(`/palabra/${id}/</loc>`)) fail(`sitemap missing "${id}"`);
       if (sitemap.includes("/404")) fail("sitemap lists the 404 page");
     }
     if (existsSync(`${DIST}/llms.txt`)) {
       const llms = readFileSync(`${DIST}/llms.txt`, "utf8");
       for (const match of llms.matchAll(/\]\((https?:\/\/[^)]+)\)/g)) {
         const path = new URL(match[1]).pathname;
         const target = path.endsWith("/") ? `${DIST}${path}index.html` : `${DIST}${path}`;
         if (!existsSync(target)) fail(`llms.txt links to a missing page: ${match[1]}`);
       }
     }
     if (!existsSync(`${DIST}/pagefind/pagefind.js`)) fail("missing pagefind index (dist/pagefind/pagefind.js)");
   }

   if (failures.length > 0) {
     console.error(`check-dist: ${failures.length} problem(s)`);
     for (const message of failures) console.error(` - ${message}`);
     process.exit(1);
   }
   console.log(`check-dist: OK (${pages.length} pages${FULL ? ", full" : ""})`);
   ```
Luego `npm run format`.

**Done when**
- [ ] WHEN `npm run build` runs THE SYSTEM SHALL exit 0 and `node scripts/check-dist.mjs` SHALL exit 0.
- [ ] WHEN a word id exists in `words.json` THE SYSTEM SHALL emit `dist/palabra/<id>/index.html` (y ninguna página de palabra que no esté en el JSON).
- [ ] WHEN each category used by `words.json` exists THE SYSTEM SHALL emit `dist/categoria/<categoría>/index.html`, and SHALL emit `dist/a-z/index.html`.
- [ ] WHEN any built page is read THE SYSTEM SHALL have exactly one `<h1>`, a unique `<title>` and a unique meta description.
- [ ] WHEN a word page is read THE SYSTEM SHALL contain a valid `DefinedTerm` JSON-LD block.
- [ ] WHEN any built page links to `/palabra/<id>/` THE SYSTEM SHALL have a page for that id (`check-dist` falla ante un enlace roto; en este paso `viral` apunta a `meme` y `trending`, que aún no existen, así que esos enlaces NO deben renderizarse).

**Verify**
```bash
npm run format                                    # expect: exit 0
npm run check                                     # expect: exit 0
npm run lint                                      # expect: exit 0
npm run build                                     # expect: exit 0
node scripts/check-dist.mjs                       # expect: exit 0, prints "check-dist: OK"
test -f dist/palabra/viral/index.html             # expect: exit 0
test -f dist/categoria/gen-z/index.html           # expect: exit 0
test -f dist/a-z/index.html                       # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 4: word, category and A-Z pages with dist audit"
git tag step-04-pages
# rollback target if step 5 goes wrong: git reset --hard step-04-pages
```

---

#### Step 5 — Contenido, lote 1 (Redes sociales y Gen Z)

**Do**
1. Crea `tests/fixtures/headwords.json` con **exactamente** este contenido (la lista oficial de 100 titulares, 25 por categoría):
   ```json
   {
     "redes-sociales": [
       "viral", "trending", "influencer", "meme", "hater", "troll", "spoiler", "clickbait",
       "shadowban", "cancelar", "fandom", "stan", "shippear", "pov", "ratio", "doomscrolling",
       "fomo", "streamer", "algoritmo", "engagement", "hilo", "storytime", "collab", "unfollow",
       "fyp"
     ],
     "gen-z": [
       "cringe", "random", "vibe", "mood", "slay", "rizz", "delulu", "based", "sus", "npc",
       "main-character", "bro", "flexear", "drip", "aesthetic", "pick-me", "boomer", "zoomer",
       "glow-up", "lowkey", "highkey", "no-cap", "bestie", "periodt", "ate"
     ],
     "internet-gaming": [
       "noob", "gg", "farmear", "lag", "tilt", "nerfear", "buffear", "smurf", "camper", "tryhard",
       "grindear", "afk", "ez", "loot", "skin", "speedrun", "gacha", "main", "carry", "feeder",
       "rage-quit", "meta", "clutch", "op", "bug"
     ],
     "relaciones-actitudes": [
       "crush", "ghosting", "red-flag", "green-flag", "situationship", "love-bombing", "gaslighting",
       "breadcrumbing", "benching", "simp", "friendzone", "ick", "toxic", "soft-launch",
       "hard-launch", "catfish", "stalkear", "flirtear", "match", "orbiting", "cuffing-season",
       "bae", "baddie", "chad", "yapear"
     ]
   }
   ```
2. Crea `tests/unit/coverage.test.ts` (importa de `../../src/lib/word-schema` y `../../src/lib/text`, sin extensión, y de `node:fs` y `vitest`) con estas pruebas:
   - Lee `tests/fixtures/headwords.json` y `src/data/words.json`; parsea cada palabra con `wordSchema.parse`; `expected` es `(process.env.EXPECT_CATEGORIES ?? "").split(",").filter(Boolean)`.
   - **Fixture:** sus claves ordenadas son iguales a `CATEGORIES` ordenado; cada categoría tiene exactamente 25 titulares; no hay ids repetidos entre categorías.
   - **words.json:** no tiene ids repetidos; cada palabra es un titular de la lista **de su propia categoría**; `slugify(term) === id` para cada una; cada id de `related` es un titular conocido y distinto del id de la propia palabra; `sensitivity` y demás campos pasan el esquema.
   - **Completitud:** para cada categoría en `expected`, la lista de titulares de esa categoría que faltan en `words.json` es `[]` (usa `it.each(expected)`).
   - **Relacionadas existentes:** si `expected` contiene las 4 categorías, cada id de `related` existe en `words.json`.
3. Edita `src/data/words.json`: **añade** (sin tocar las 4 entradas del paso 3) las entradas que faltan de `redes-sociales` y `gen-z`: los 24 titulares restantes de cada una (todos menos `viral` y `cringe`). Sigue el contrato de redacción de §4. Los `related` pueden apuntar a cualquier titular de la lista, aunque aún no tenga entrada.
Luego `npm run format`.

**Done when**
- [ ] WHEN `EXPECT_CATEGORIES=redes-sociales,gen-z npx vitest run tests/unit/coverage.test.ts` runs THE SYSTEM SHALL exit 0 with 0 failed (todos los titulares de esas dos categorías tienen entrada).
- [ ] WHEN `words.json` contains an id not in the headword fixture THE SYSTEM SHALL fail the coverage test.
- [ ] WHEN `npm run build` runs THE SYSTEM SHALL exit 0 and `node scripts/check-dist.mjs` SHALL exit 0 (una página por entrada).
- [ ] WHEN `npm test` runs THE SYSTEM SHALL exit 0 with 0 failed and 0 skipped.

**Verify**
```bash
npm run format                                                                        # expect: exit 0
npm run lint                                                                          # expect: exit 0
EXPECT_CATEGORIES=redes-sociales,gen-z npx vitest run tests/unit/coverage.test.ts     # expect: exit 0, 0 failed
npm test                                                                              # expect: exit 0, 0 failed, 0 skipped
npm run build                                                                         # expect: exit 0
node scripts/check-dist.mjs                                                           # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 5: content batch 1 (redes sociales, gen z)"
git tag step-05-content-1
# rollback target if step 6 goes wrong: git reset --hard step-05-content-1
```

---

#### Step 6 — Contenido, lote 2 (Internet y gaming; Relaciones y actitudes)

**Do**
Edita `src/data/words.json`: **añade** los 24 titulares restantes de `internet-gaming` (todos menos `noob`) y los 24 restantes de `relaciones-actitudes` (todos menos `crush`), siguiendo el contrato de redacción de §4. No modifiques entradas existentes salvo para corregir un `related` que ahora sea inexistente. Luego `npm run format`.

**Done when**
- [ ] WHEN `EXPECT_CATEGORIES=redes-sociales,gen-z,internet-gaming,relaciones-actitudes npx vitest run tests/unit/coverage.test.ts` runs THE SYSTEM SHALL exit 0 (los 100 titulares tienen entrada y todo `related` apunta a una entrada existente).
- [ ] WHEN `npm run build` runs THE SYSTEM SHALL exit 0 and `node scripts/check-dist.mjs` SHALL exit 0.
- [ ] WHEN an entry violates the schema (lengths, 2 ejemplos, categoría válida) THE SYSTEM SHALL fail the build.
- [ ] WHEN `npm test` runs THE SYSTEM SHALL exit 0 with 0 failed and 0 skipped.

**Verify**
```bash
npm run format                                                                                                # expect: exit 0
npm run lint                                                                                                  # expect: exit 0
EXPECT_CATEGORIES=redes-sociales,gen-z,internet-gaming,relaciones-actitudes npx vitest run tests/unit/coverage.test.ts   # expect: exit 0, 0 failed
npm test                                                                                                      # expect: exit 0, 0 failed, 0 skipped
npm run build                                                                                                 # expect: exit 0
node scripts/check-dist.mjs                                                                                   # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 6: content batch 2 (gaming, relaciones)"
git tag step-06-content-2
# rollback target if step 7 goes wrong: git reset --hard step-06-content-2
```

---

#### Step 7 — Búsqueda

**Do**
1. Edita `astro.config.mjs` con **dos cambios exactos** (el archivo viene de §19.6): (a) añade `import pagefind from "astro-pagefind";` junto a los otros imports; (b) cambia la línea `integrations: [sitemap({ filter: (page) => !page.includes("/404") })],` por `integrations: [sitemap({ filter: (page) => !page.includes("/404") }), pagefind()],`.
2. `src/pages/buscar.astro`: usa `Base` con `title="Buscar una palabra | Jerga Viva"`, `description="Busca una palabra de jerga moderna y descubre su significado, ejemplos y origen."`, `path="/buscar/"`; contenido: `<h1>Buscar una palabra</h1>` y el componente de búsqueda importado con `import Search from "astro-pagefind/components/Search.astro";` usado como `<Search instance="search" className="pagefind-ui" searchboxOptions={{ placeholder: "Escribe una palabra…" }} />`. Esta página lleva `data-pagefind-ignore="all"` en su contenedor para no indexarse a sí misma. **Si `npm run check` rechaza esas props**, abre `node_modules/astro-pagefind/README.md` y usa las props que documenta; no cambies el criterio de "Done when".
3. `tests/e2e/search.spec.ts`:
   ```ts
   import { expect, test } from "@playwright/test";

   test("searching 'cringe' lists the cringe entry", async ({ page }) => {
     await page.goto("/buscar/");
     await page.locator(".pagefind-ui__search-input").fill("cringe");
     const result = page.locator(".pagefind-ui__result-link", { hasText: "Cringe" }).first();
     await expect(result).toBeVisible();
     await expect(result).toHaveAttribute("href", /\/palabra\/cringe\//);
   });

   test("searching nonsense shows no result links", async ({ page }) => {
     await page.goto("/buscar/");
     await page.locator(".pagefind-ui__search-input").fill("zzqxjv");
     await expect(page.locator(".pagefind-ui__result-link")).toHaveCount(0);
   });
   ```
   Si los selectores `.pagefind-ui__search-input` / `.pagefind-ui__result-link` no existen en el DOM real (cámbialos mirando la página renderizada con `npm run preview`), ajusta **el selector**, nunca la aserción.
Luego `npm run format`.

**Done when**
- [ ] WHEN `npm run build` runs THE SYSTEM SHALL exit 0 and write `dist/pagefind/pagefind.js`.
- [ ] WHEN a user types "cringe" on `/buscar/` THE SYSTEM SHALL show a result link whose href matches `/palabra/cringe/`.
- [ ] WHEN a user types a string with no match THE SYSTEM SHALL show zero result links.
- [ ] WHEN `dist/index.html` is read THE SYSTEM SHALL NOT reference any Pagefind file (la portada se mantiene ligera).
- [ ] WHEN `node scripts/check-dist.mjs` runs THE SYSTEM SHALL exit 0.

**Verify**
```bash
npm run format                                              # expect: exit 0
npm run check                                               # expect: exit 0
npm run lint                                                # expect: exit 0
npm run build                                               # expect: exit 0
test -f dist/pagefind/pagefind.js                           # expect: exit 0
grep -qi 'pagefind' dist/index.html; test $? -eq 1          # expect: exit code 1 → this line exits 0 (la portada no carga Pagefind)
node scripts/check-dist.mjs                                 # expect: exit 0
npx playwright test tests/e2e/search.spec.ts                # expect: exit 0, 0 failed
```

**Checkpoint**
```bash
git add -A && git commit -m "step 7: pagefind search"
git tag step-07-search
# rollback target if step 8 goes wrong: git reset --hard step-07-search
```

---

#### Step 8 — Portada, Palabra del día y Compartir

**Do**
1. Reescribe `src/pages/index.astro` (mismos `title`/`description`/`path` del paso 2) con: `<h1>Jerga Viva: el diccionario de la jerga moderna</h1>` seguido de un subrayado decorativo rosa (un `<span aria-hidden="true">` de 6 px de alto con `bg-accent`); un párrafo de una frase y un botón-enlace "Buscar una palabra" a `/buscar/`; la sección Palabra del día con el marcado exacto de §6 (con `data-daily`, `<h2 id="daily-title">`, `<a data-daily-link>` mostrando el término, y un `<p data-daily-definition>` con la definición); y una cuadrícula con un enlace por categoría a `/categoria/<id>/` que muestra la etiqueta y cuántas palabras tiene (el número se calcula de la colección, no se escribe a mano).
   - **Servidor:** elige la palabra inicial con `dayIndex(new Date(), words.length)` sobre la lista ordenada por `id`.
   - **Datos para el cliente:** `<script id="daily-data" type="application/json" set:html={JSON.stringify(list)} />` con `list` = arreglo `{ id, term, definition }` ordenado por `id`.
   - **Script de cliente** (un `<script>` de Astro, TypeScript, importando `dayIndex` de `../lib/text`): lee `#daily-data`; si la lista no está vacía calcula `dayIndex(new Date(), list.length)` y actualiza el texto de `[data-daily-link]`, su `href` (`/palabra/<id>/`) y `[data-daily-definition]`. Si falta algún elemento o el JSON no se puede leer, no hace nada (queda la palabra del servidor).
2. `src/components/ShareButton.astro` — props `url: string`, `title: string`. Renderiza `<button type="button" data-share data-url={url} data-title={title}>Compartir</button>` (estilo píldora con `--primary`) y `<p role="status" data-share-status class="text-success"></p>` vacío. Su `<script>` de Astro, al hacer clic: si `navigator.share` existe llama `navigator.share({ title, url })` (y, si rechaza con error que no sea `AbortError`, cae al portapapeles); si no, `navigator.clipboard.writeText(url)` y escribe "Enlace copiado" en `[data-share-status]`; si el portapapeles falla escribe "No se pudo copiar el enlace". Al pasar `url` desde la página usa la URL canónica absoluta.
3. Edita `src/pages/palabra/[slug].astro` para mostrar `<ShareButton url={canonicalUrl} title={entry.data.term} />` después de la definición.
4. `tests/e2e/home.spec.ts`:
   ```ts
   import { expect, test } from "@playwright/test";

   test("home shows a daily word whose link resolves", async ({ page }) => {
     await page.goto("/");
     await expect(page.getByRole("heading", { name: "Palabra del día" })).toBeVisible();
     const link = page.locator("[data-daily-link]");
     await expect(link).toHaveAttribute("href", /^\/palabra\/[a-z0-9-]+\/$/);
     await link.click();
     await expect(page).toHaveURL(/\/palabra\/[a-z0-9-]+\/$/);
     await expect(page.locator("h1")).toHaveCount(1);
   });

   test("share button copies the canonical url when navigator.share is missing", async ({
     page,
     context,
   }) => {
     await context.grantPermissions(["clipboard-read", "clipboard-write"]);
     await page.addInitScript(() => {
       Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
     });
     await page.goto("/palabra/viral/");
     await page.getByRole("button", { name: "Compartir" }).click();
     await expect(page.locator("[data-share-status]")).toHaveText("Enlace copiado");
     const copied = await page.evaluate(() => navigator.clipboard.readText());
     expect(copied).toMatch(/\/palabra\/viral\/$/);
   });

   test("home links to every category page", async ({ page }) => {
     await page.goto("/");
     for (const id of ["redes-sociales", "gen-z", "internet-gaming", "relaciones-actitudes"]) {
       await expect(page.locator(`a[href="/categoria/${id}/"]`).first()).toBeVisible();
     }
   });
   ```
Luego `npm run format`.

**Done when**
- [ ] WHEN the home page loads THE SYSTEM SHALL show a "Palabra del día" whose link `href` matches `/palabra/<id>/` and whose destination returns a word page with exactly one `h1`.
- [ ] WHEN `navigator.share` is unavailable and the user clicks "Compartir" THE SYSTEM SHALL write "Enlace copiado" in the status region and put the canonical URL in the clipboard.
- [ ] WHEN the home page loads THE SYSTEM SHALL link to all four category pages.
- [ ] WHEN `node scripts/check-dist.mjs` runs THE SYSTEM SHALL exit 0.

**Verify**
```bash
npm run format                                    # expect: exit 0
npm run check                                     # expect: exit 0
npm run lint                                      # expect: exit 0
npm test                                          # expect: exit 0, 0 failed, 0 skipped
npm run build                                     # expect: exit 0
node scripts/check-dist.mjs                       # expect: exit 0
grep -qi 'pagefind' dist/index.html; test $? -eq 1   # expect: exit code 1 → this line exits 0
npx playwright test tests/e2e/home.spec.ts        # expect: exit 0, 0 failed
```

**Checkpoint**
```bash
git add -A && git commit -m "step 8: home, word of the day and share"
git tag step-08-home
# rollback target if step 9 goes wrong: git reset --hard step-08-home
```

---

#### Step 9 — SEO, `llms.txt`, páginas legales y cabeceras

**Do**
1. `src/pages/robots.txt.ts`:
   ```ts
   import type { APIRoute } from "astro";

   export const GET: APIRoute = ({ site }) => {
     const base = site ?? new URL("https://jerga-viva.pages.dev");
     const body = `User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap-index.xml", base).href}\n`;
     return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
   };
   ```
2. `src/pages/llms.txt.ts` — endpoint `GET` análogo que devuelve `text/plain; charset=utf-8` con este formato (todas las URLs absolutas con la base del sitio y barra final):
   ```
   # Jerga Viva

   > El diccionario de la jerga moderna en español: significado, ejemplos y origen de palabras de redes sociales, Gen Z, gaming y relaciones.

   ## Categorías

   - [Redes sociales](<base>/categoria/redes-sociales/)
   - … una línea por categoría …

   ## Palabras

   - [Viral](<base>/palabra/viral/): <definición>
   - … una línea por palabra, orden alfabético por término …
   ```
   Lee la colección con `getCollection("words")`; las etiquetas de categoría salen de `CATEGORY_LABELS`.
3. `src/pages/acerca.astro` — `title="Acerca del diccionario | Jerga Viva"`, `description="Qué es Jerga Viva, cómo se escriben las entradas y cómo corregir una definición."`, `path="/acerca/"`. `<h1>Acerca de Jerga Viva</h1>` y estas tres secciones `<h2>`: **Qué es** (diccionario gratuito de jerga moderna en español, sin cuentas); **Cómo se escriben las entradas** (texto exacto: "Las definiciones se redactan con ayuda de inteligencia artificial y todavía no han pasado por una revisión humana completa. La jerga cambia rápido: si ves algo desactualizado o incorrecto, será corregido en una próxima versión."); **Política de contenido** (incluye palabras vulgares o usadas como insulto porque forman parte del lenguaje real, siempre con una etiqueta de advertencia; no se definen insultos dirigidos a grupos protegidos).
4. `src/pages/404.astro` — `Base` con `noindex`, `title="Página no encontrada | Jerga Viva"`, `description="Esa página no existe en Jerga Viva."`, `path="/404.html"`; `<h1>Esa palabra no existe (todavía)</h1>` y enlaces a "/" y "/buscar/".
5. `public/_headers`:
   ```
   /*
     X-Content-Type-Options: nosniff
     Referrer-Policy: strict-origin-when-cross-origin
     X-Frame-Options: DENY
     Permissions-Policy: camera=(), microphone=(), geolocation=()

   /_astro/*
     Cache-Control: public, max-age=31536000, immutable
   ```
Luego `npm run format`.

**Done when**
- [ ] WHEN `node scripts/check-dist.mjs --full` runs THE SYSTEM SHALL exit 0 (sitemap con cada palabra y sin la 404, `llms.txt` cuyos enlaces existen, robots, `_headers`, índice de búsqueda).
- [ ] WHEN the site is built with `SITE_URL=https://example.test` THE SYSTEM SHALL use that origin in `sitemap-0.xml`, `robots.txt` and `llms.txt`.
- [ ] WHEN `dist/404.html` is read THE SYSTEM SHALL contain `noindex`.
- [ ] WHEN `dist/_headers` is read THE SYSTEM SHALL contain `X-Content-Type-Options: nosniff`.
- [ ] WHEN `npm run build` runs without `SITE_URL` THE SYSTEM SHALL fall back to `https://jerga-viva.pages.dev`.

**Verify**
```bash
npm run format                                                                  # expect: exit 0
npm run check                                                                   # expect: exit 0
npm run lint                                                                    # expect: exit 0
npm run build                                                                   # expect: exit 0
node scripts/check-dist.mjs --full                                              # expect: exit 0
grep -q 'noindex' dist/404.html                                                 # expect: exit 0
grep -q 'X-Content-Type-Options: nosniff' dist/_headers                         # expect: exit 0
SITE_URL=https://example.test npm run build                                     # expect: exit 0
grep -q 'https://example.test/palabra/viral/' dist/sitemap-0.xml                # expect: exit 0
grep -q 'Sitemap: https://example.test/sitemap-index.xml' dist/robots.txt       # expect: exit 0
grep -q 'https://example.test/palabra/viral/' dist/llms.txt                     # expect: exit 0
npm run build                                                                   # expect: exit 0 (restaura el build con la URL por defecto)
grep -q 'https://jerga-viva.pages.dev/' dist/sitemap-0.xml                      # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 9: seo, llms.txt, legal pages, headers"
git tag step-09-seo
# rollback target if step 10 goes wrong: git reset --hard step-09-seo
```

---

#### Step 10 — Accesibilidad, responsive y teclado

**Do**
1. `tests/e2e/a11y.spec.ts`:
   ```ts
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
   ```
   El `exclude(".pagefind-ui")` deja fuera solo el widget de terceros; el teclado sobre él lo cubre `keyboard.spec.ts`. Si axe reporta un fallo de contraste en un token propio, corrige el hex en `global.css` y en la tabla de §7.
2. `tests/e2e/responsive.spec.ts`:
   ```ts
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
   ```
3. `tests/e2e/keyboard.spec.ts`:
   ```ts
   import { expect, test } from "@playwright/test";

   test("first Tab stop is the skip link and it targets main", async ({ page }) => {
     await page.goto("/");
     await page.keyboard.press("Tab");
     const focused = page.locator(":focus");
     await expect(focused).toHaveText("Saltar al contenido");
     await expect(focused).toHaveAttribute("href", "#main");
   });

   test("main navigation links are reachable with Tab", async ({ page }) => {
     await page.goto("/");
     const labels = ["Inicio", "A–Z", "Buscar", "Acerca"];
     const reached: string[] = [];
     for (let i = 0; i < 12 && reached.length < labels.length; i++) {
       await page.keyboard.press("Tab");
       const text = ((await page.locator(":focus").textContent()) ?? "").trim();
       if (labels.includes(text) && !reached.includes(text)) reached.push(text);
     }
     expect(reached.sort()).toEqual([...labels].sort());
   });

   test("search input on /buscar/ is reachable by keyboard", async ({ page }) => {
     await page.goto("/buscar/");
     let found = false;
     for (let i = 0; i < 20 && !found; i++) {
       await page.keyboard.press("Tab");
       found = await page.locator(".pagefind-ui__search-input").evaluate(
         (el) => el === document.activeElement,
       );
     }
     expect(found).toBe(true);
   });
   ```
Luego `npm run format`.

**Done when**
- [ ] WHEN axe (WCAG 2.2 AA) runs on `/`, `/a-z/`, `/categoria/gen-z/`, `/palabra/viral/`, `/buscar/` and `/acerca/` in light and dark THE SYSTEM SHALL report zero violations.
- [ ] WHEN each of those routes loads at 360 px width THE SYSTEM SHALL not scroll horizontally.
- [ ] WHEN the user presses Tab on `/` THE SYSTEM SHALL focus the skip link first, and SHALL reach all four main navigation links.
- [ ] WHEN the user tabs through `/buscar/` THE SYSTEM SHALL focus the search input.

**Verify**
```bash
npm run format                                  # expect: exit 0
npm run lint                                    # expect: exit 0
npm run build                                   # expect: exit 0
npx playwright test                             # expect: exit 0, 0 failed (todos los e2e, proyectos desktop y mobile)
```

**Checkpoint**
```bash
git add -A && git commit -m "step 10: accessibility, responsive and keyboard tests"
git tag step-10-a11y
# rollback target if step 11 goes wrong: git reset --hard step-10-a11y
```

---

#### Step 11 — README y compuerta final

**Do**
Crea `README.md` (en español) con: qué es el proyecto; requisitos (Node 24 LTS); comandos (`npm install`, `npm run dev`, `npm run build`, `npm run preview`, `npm test`, `npm run test:e2e`, `npm run audit:dist`); **cómo añadir una palabra** (añadir un objeto a `src/data/words.json` siguiendo el esquema de `src/lib/word-schema.ts` y el contrato de redacción de §4, y añadir su id a `tests/fixtures/headwords.json` en la categoría correspondiente — este blueprint fija 25 por categoría: si añades una, ajusta también esa aserción en `tests/unit/coverage.test.ts`); y **cómo desplegar en Cloudflare Pages** con estos valores literales: build command `npm run build`, output directory `dist`, variable de entorno `NODE_VERSION` = `24` (si el panel no la reconoce, el archivo `.nvmrc` ya fija la major), variable `SITE_URL` = la URL final del sitio. Luego ejecuta la compuerta global de §20.1 completa.

**Done when**
- [ ] WHEN the §20.1 commands run on the final tree THE SYSTEM SHALL exit 0 on every line.
- [ ] WHEN `README.md` is read THE SYSTEM SHALL contain the strings `npm run build`, `dist` and `SITE_URL`.
- [ ] WHEN `git tag -l 'step-*'` runs THE SYSTEM SHALL list a tag for every step of §9.

**Verify**
```bash
npm ci                                  # expect: exit 0
npm run check                           # expect: exit 0
npm run lint                            # expect: exit 0
npm test                                # expect: exit 0, 0 failed, 0 skipped
npm run build                           # expect: exit 0
node scripts/check-dist.mjs --full      # expect: exit 0
npm run test:e2e                        # expect: exit 0, 0 failed
grep -q 'npm run build' README.md       # expect: exit 0
grep -q 'SITE_URL' README.md            # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 11: readme and final gate"
git tag step-11-final
git ls-files --error-unmatch package-lock.json    # expect: exit 0 — now that it is committed
git ls-files --error-unmatch README.md            # expect: exit 0
test -z "$(git status --porcelain)"               # expect: exit 0 — the commit above took everything
```

---

### 9.1 Parity and cutover
NOT APPLICABLE — greenfield build, no system is being replaced.

---

## 10. Environment Setup

### Prerequisites
| Tool | Version | Check |
|---|---|---|
| Node.js (LTS "Krypton") | 24.21.0 | `node -v` → `v24.x` (debe ser ≥ 24.0.0) |
| npm | el que trae Node 24 (sin fijar) | `npm -v` imprime una versión |
| Git | cualquier versión reciente | `git --version` |
| Shell | bash (en Windows: Git Bash) | `echo $BASH_VERSION` imprime un valor |

**Instala Node antes de empezar:** descarga la versión LTS 24 desde nodejs.org. (En la máquina donde se diseñó este blueprint Node no estaba instalado; el blueprint **no se pudo probar** allí — ver el resultado de la prueba de humo en el mensaje de entrega.)

### Accounts to create first
| Servicio | Para qué | Enlace | Cuándo se necesita |
|---|---|---|---|
| GitHub (opcional) | Alojar el repositorio para el despliegue automático | github.com | Tras el paso 11, despliegue |
| Cloudflare (gratuito) | Cloudflare Pages | dash.cloudflare.com | Tras el paso 11, despliegue |

Ninguna cuenta es necesaria para construir y probar el sitio en local.

### Environment variables
| Variable | Purpose | Where to get it | Required by step | Secret? |
|---|---|---|---|---|
| `SITE_URL` | Origen público del sitio para canonical, sitemap, robots y `llms.txt` | La URL que asigne Cloudflare Pages o tu dominio | 9 (opcional: hay un valor por defecto) | no |

`.env.example` se commitea con la clave presente. `.env` y `.env.*` están en `.gitignore`. **Cómo se carga `SITE_URL`:** `astro.config.mjs` la lee con `process.env.SITE_URL`, y Astro **no** carga `.env` para su propio archivo de configuración; por eso se exporta en el propio comando (`SITE_URL=https://example.test npm run build`, como en el paso 9) o se define en el panel de Cloudflare. No hay secretos en este proyecto.

### Files that must be committed
| File | Why it is committed | Ignore-file exception line |
|---|---|---|
| `.env.example` | Documenta la variable | `!.env.example` después del patrón `.env.*` |
| `package.json`, `package-lock.json` | Dependencias reproducibles (`npm ci`) | — no coincide con ningún patrón |
| `.nvmrc` | Fija la major de Node en CI y en el host | — no coincide con ningún patrón |
| `astro.config.mjs`, `tsconfig.json`, `biome.json`, `vitest.config.ts`, `playwright.config.ts` | Configuración necesaria para los gates | — no coincide con ningún patrón |
| `.claude/`, `CLAUDE.md`, `AGENTS.md` | Configuración de agente | — no coincide con ningún patrón |
| `src/data/words.json`, `tests/fixtures/headwords.json` | El contenido y su lista oficial | — no coincide con ningún patrón |

### Bootstrap
Antes de este bloque: crea la carpeta `jerga-viva/`, entra en ella y **escribe los archivos de §19** (`CLAUDE.md`, `AGENTS.md`, `.claude/**` y todos los de §19.6) con su contenido exacto, incluido el `.gitignore`. Copia este blueprint a `blueprints/jerga-viva-blueprint.md`. Después ejecuta:

```bash
# order matters: ignore file + exceptions (already written) → repo init → first commit → install → browsers
# `.gitignore` ya existe (§19.6), así que `git add -A` no versiona node_modules, dist, .astro ni .env
git rev-parse --git-dir >/dev/null 2>&1 || git init -b main     # idempotent: no-op if the repo exists
git config user.name >/dev/null 2>&1 || git config user.name "builder"      # a commit needs an identity
git config user.email >/dev/null 2>&1 || git config user.email "builder@example.invalid"
git add -A && git commit -m "chore: scaffold" --allow-empty    # a tag needs a commit to point at; --allow-empty makes a second run exit 0
node -v                                                         # expect: v24.x
npm install                                                     # idempotent: writes/updates package-lock.json
npx playwright install chromium                                 # idempotent: downloads the browser once; non-interactive
git add -A && git commit -m "chore: lockfile" --allow-empty     # lockfile committed; second run is a no-op commit
```

Este bloque no tiene un `cp` de `workspace/` porque en modo archivo único los archivos de §19 se escriben a mano antes (no hay carpeta `workspace/`). No hay comandos que levanten servicios: el sitio es estático.

---

## 11. Dependencies

Todas las versiones se verificaron el **2026-10-03**. Salvo donde se indica, el origen es el `dist-tags` `latest` del registro de npm. Todos los paquetes se instalan con `npm install` en Bootstrap (§10), a partir del `package.json` de §19.6 (versiones exactas, sin `^`).

### Runtime
| Package | Version | Source (registry URL or track file) | Checked | Installed by | Purpose |
|---|---|---|---|---|---|
| astro | 7.3.5 | https://registry.npmjs.org/-/package/astro/dist-tags (engines: Node >=22.12.0 leído en https://registry.npmjs.org/astro/7.3.5) | 2026-10-03 | §10 Bootstrap | Framework estático |
| tailwindcss | 4.3.3 | https://registry.npmjs.org/-/package/tailwindcss/dist-tags | 2026-10-03 | §10 Bootstrap | Estilos |
| @tailwindcss/vite | 4.3.3 | https://registry.npmjs.org/-/package/@tailwindcss/vite/dist-tags (peer vite `^5.2.0 \|\| ^6 \|\| ^7 \|\| ^8`, leído; Astro 7.3.5 usa vite ^8.0.13) | 2026-10-03 | §10 Bootstrap | Plugin de Tailwind para Vite |
| @astrojs/sitemap | 3.7.4 | https://registry.npmjs.org/-/package/@astrojs/sitemap/dist-tags (sin peers declarados, leído en /3.7.4) | 2026-10-03 | §10 Bootstrap | `sitemap-index.xml` y `sitemap-0.xml` |
| astro-pagefind | 2.0.1 | https://registry.npmjs.org/-/package/astro-pagefind/dist-tags (peer astro incluye ^7, leído en /2.0.1; dependencias: pagefind ^1.5.0, `latest` de pagefind 1.5.2) — **la sintaxis del componente `Search` viene del README resumido, no verificada: ver paso 7** | 2026-10-03 | §10 Bootstrap | Índice de búsqueda estático |

### Development
| Package | Version | Source (registry URL or track file) | Checked | Installed by | Purpose |
|---|---|---|---|---|---|
| typescript | 6.0.3 | https://registry.npmjs.org/typescript/6.0.3 (existe); se fija en 6.x a propósito: `latest` es 7.0.2 pero Astro declara `typescript ^6.0.3` y `knowledge/runtime-tracks/ts-node.md` advierte que el tooling de Astro debe quedarse en 6.x | 2026-10-03 | §10 Bootstrap | Tipos |
| @astrojs/check | 0.9.10 | https://registry.npmjs.org/-/package/@astrojs/check/dist-tags (peer typescript `^5 \|\| ^6`, leído) | 2026-10-03 | §10 Bootstrap | `npm run check` (`astro check`) |
| @biomejs/biome | 2.5.15 | https://registry.npmjs.org/-/package/@biomejs/biome/dist-tags | 2026-10-03 | §10 Bootstrap | Lint y formato de `.ts`/`.mjs` |
| vitest | 5.0.3 | https://registry.npmjs.org/-/package/vitest/dist-tags (engines `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0`, leído en /5.0.3) | 2026-10-03 | §10 Bootstrap | Tests unitarios |
| @playwright/test | 1.63.0 | https://registry.npmjs.org/-/package/@playwright/test/dist-tags | 2026-10-03 | §10 Bootstrap | Tests e2e |
| @axe-core/playwright | 4.13.0 | https://registry.npmjs.org/-/package/@axe-core/playwright/dist-tags | 2026-10-03 | §10 Bootstrap | Accesibilidad en e2e |
| @types/node | 26.6.4 | https://registry.npmjs.org/-/package/@types/node/dist-tags (`latest`). **Son los tipos de Node 26; el runtime es Node 24 LTS**: podrían declarar APIs que Node 24 no tiene. Se acepta para un prototipo | 2026-10-03 | §10 Bootstrap | Tipos de `node:fs` en tests y scripts |

### Herramientas del sistema (no se instalan con npm)
| Tool | Version | Source | Checked | Installed by | Purpose |
|---|---|---|---|---|---|
| Node.js | 24.21.0 (LTS "Krypton") | https://nodejs.org/dist/index.json | 2026-10-03 | Manual, §10 Prerequisites | Runtime |
| npm | **UNVERIFIED — verify before install** (el que trae Node 24) | — | — | Viene con Node | Gestor de paquetes |

### Deliberately not used
| Rejected | Instead | Why |
|---|---|---|
| pnpm | npm | La major actual cambió el manejo de scripts de instalación de dependencias y no se pudo probar en esta máquina; npm ya viene con Node |
| TypeScript 7.x | TypeScript 6.0.3 | Astro declara `^6.0.3` y su tooling no soporta aún el compilador nativo |
| Next.js / React | Astro con componentes `.astro` | No hay estado que justifique hidratación |
| ESLint + Prettier | Biome | Una sola herramienta; solo procesa `.ts`/`.mjs` |
| satori / resvg (imágenes OG por palabra) | Sin imagen OG en v1 | Fuera de alcance (§1 Non-Goals) |
| GitHub Actions | Compilación en Cloudflare Pages | Las versiones de las acciones no se pudieron verificar; evita pins de memoria |
| zod como dependencia directa | `import { z } from "astro/zod"` | Astro lo reexporta; una dependencia menos |
| Lighthouse CI | Auditoría con `check-dist.mjs` y axe | No hay una versión verificada y la señal es mejor con propiedades concretas |

---

## 12. Deployment Strategy

### Hosting
**Cloudflare Pages**, plan gratuito, despliegue desde Git. Valores: build command `npm run build`; output directory `dist`; variable `NODE_VERSION=24` (documentada en Cloudflare; si el panel no la respeta, `.nvmrc` con `24` es el respaldo); variable `SITE_URL` = la URL final.

### Environments
| Environment | Branch | URL | Database | Third-party mode |
|---|---|---|---|---|
| Local | — | `http://127.0.0.1:4321` | NOT APPLICABLE | — |
| Preview | cualquier rama / PR | URL automática de Cloudflare Pages | NOT APPLICABLE | — |
| Production | `main` | `https://jerga-viva.pages.dev` (provisional) o dominio propio | NOT APPLICABLE | — |

### CI/CD
No hay pipeline propio (ver §1 Non-Goals y §11). Cloudflare Pages ejecuta `npm ci`/`npm install` y `npm run build` en cada push; la compuerta completa de §20.1 se ejecuta **a mano antes de fusionar a `main`**.

### Release and rollback
Cada push a `main` despliega. Rollback: en el panel de Cloudflare Pages, "Rollback" al despliegue anterior (inmediato, sin recompilar), o `git revert` + push. Sin migraciones.

### Domain, DNS, TLS
Con el subdominio `*.pages.dev` el certificado es automático. Con dominio propio: añadirlo en Cloudflare Pages → Custom domains y seguir el asistente (Cloudflare crea el registro CNAME y el certificado). Si hay `www` y apex, elegir uno canónico y redirigir el otro desde Cloudflare. Tras cambiar el dominio, actualizar `SITE_URL`.

---

## 13. Testing Strategy

| Layer | Framework | What it covers | Where | Runs |
|---|---|---|---|---|
| Unit | Vitest | `slugify`, `letterOf`, `truncate`, `dayIndex`, esquema de entradas, cobertura y coherencia de `words.json` | `tests/unit/` | cada commit (`npm test`) |
| Integration (build) | Astro build + `scripts/check-dist.mjs` | Cada entrada genera su página; títulos, descripciones y canonical únicos; JSON-LD; sitemap, `llms.txt`, robots | `scripts/` | cada commit |
| E2E | Playwright (Chromium, perfiles desktop y mobile) + axe | Búsqueda, portada, compartir, accesibilidad, responsive, teclado | `tests/e2e/` | antes de fusionar |

### Critical flows to cover E2E
1. Buscar una palabra y llegar a su página (`search.spec.ts`).
2. Abrir la Palabra del día y compartir/copiar el enlace (`home.spec.ts`).
3. Recorrer el sitio solo con teclado: skip link, navegación y búsqueda (`keyboard.spec.ts`).

### Test data
El "dato" de test es el propio `src/data/words.json` más `tests/fixtures/headwords.json`; los tests e2e se ejecutan contra el build servido con `astro preview` (Playwright arranca y detiene el servidor). No hay base de datos ni estado compartido mutable.

### What is deliberately not tested
- La calidad lingüística de las definiciones (no es decidible por una máquina; ver riesgo en §20.2).
- La apariencia visual pixel a pixel (no hay snapshots).
- El menú nativo de compartir (`navigator.share`) del móvil real: el test cubre el camino de respaldo (portapapeles).
- La UI interna de Pagefind en accesibilidad (se excluye `.pagefind-ui` de axe; solo se prueba el teclado).

---

## 14. Security & Secrets

| Concern | Control | Implemented in |
|---|---|---|
| Secret storage | No hay secretos en el proyecto | — |
| Input validation | Esquema zod en cada entrada, validado en el build | `src/lib/word-schema.ts`, `src/content.config.ts` |
| Output encoding / XSS | Astro escapa las expresiones por defecto. `set:html` solo se usa con `JSON.stringify` de datos propios (JSON-LD y `daily-data`); ese JSON no contiene HTML ejecutable. Nunca se usa `set:html` con texto de una entrada | `Base.astro`, `index.astro` |
| SQL injection | NOT APPLICABLE — no hay base de datos | — |
| AuthN / AuthZ | NOT APPLICABLE | — |
| CSRF | NOT APPLICABLE — no hay formularios ni sesiones | — |
| Rate limiting / abuse | Lo absorbe el CDN; no hay origen dinámico | Cloudflare Pages |
| Dependency audit | `npm audit --omit=dev` revisado a mano antes de lanzar (§20.1) | manual |
| Security headers | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. **Sin `Content-Security-Policy` en v1**: Pagefind usa WebAssembly y scripts en línea de Astro; añadirla sin poder probarla rompería la búsqueda | `public/_headers` |
| PII handling | No se recopilan datos personales, ni cookies, ni analítica propia | — |
| Logging hygiene | NOT APPLICABLE — no hay servidor propio | — |

**Hard rules:** no se commitea ningún `.env`; nada que llegue al navegador se considera privado.
Régimen regulado: ninguno (sin datos personales). Si más adelante se añade analítica de terceros, evaluar consentimiento de cookies antes.

---

## 15. Accessibility

**Target: WCAG 2.2 Level AA.** Es parte de los criterios "Done when" (pasos 2, 4, 8, 10), no un pulido posterior.

### Baseline requirements
| Requirement | Rule |
|---|---|
| Semantic HTML | `header`/`nav`/`main`/`footer`, un `h1` por página, encabezados en orden, listas para listas |
| Keyboard | Todo operable con teclado; skip link como primer foco; sin trampas |
| Focus visible | Anillo de 3 px en `--primary` con 3 px de separación (≥ 3:1) |
| Contrast | Texto 4,5:1 y límites de UI 3:1 — la paleta de §7 lo cumple |
| Forms | El único campo es el de Pagefind (widget de terceros con su propia etiqueta) |
| Images | No hay imágenes de contenido; el favicon es decorativo; los adornos llevan `aria-hidden="true"` |
| Motion | Se respeta `prefers-reduced-motion: reduce` (bloque en `global.css`) |
| Zoom / reflow | Sin scroll horizontal a 360 px (probado) y usable al 200% |
| Live regions | El estado de "Compartir" usa `role="status"` |

### WCAG 2.2 additions
| SC | Requirement | Cómo se cumple |
|---|---|---|
| 2.4.11 Focus Not Obscured | Sin elementos fijos que tapen el foco | No hay cabeceras ni barras fijas |
| 2.5.8 Target Size (Min) | Objetivos ≥ 24×24 px | Enlaces de navegación con `min-h-11`; botón Compartir con relleno amplio |
| 2.5.7, 3.3.7, 3.3.8 | Arrastre, entrada redundante, autenticación | NOT APPLICABLE — no hay arrastre, formularios multipaso ni login |

### Verification
```bash
npx playwright test tests/e2e/a11y.spec.ts   # expect: exit 0, zero axe violations (claro y oscuro, 6 rutas)
```
Pases manuales antes de lanzar: recorrido solo con teclado, una pasada con lector de pantalla por una página de palabra y la búsqueda, y zoom al 200% a 360 px.

---

## 16. Observability & Cost

### Instrumentation
| Signal | Tool | What it captures | Who looks at it |
|---|---|---|---|
| Errors | NOT APPLICABLE — no hay código de servidor; el JS de cliente son dos scripts triviales | — | — |
| Logs | Registro de compilación de Cloudflare Pages | Fallos de build | quien despliega |
| Metrics | Informes de Google Search Console (indexación, Core Web Vitals reales) | Ver §1 | quien mantiene el sitio |
| Uptime | Opcional tras el lanzamiento: cualquier monitor gratuito sobre `/` | Disponibilidad | quien mantiene el sitio |

Analítica de visitas: opcional y posterior (Cloudflare Web Analytics no usa cookies ni exige aviso). No se incluye en v1.

### The metrics that matter for this project
| Metric | Target | Alert at |
|---|---|---|
| Páginas de palabra indexadas / total | ≥ 80% a las 8 semanas | < 50% a las 8 semanas |
| LCP móvil (campo) en portada y palabra | "Bueno" (≤ 2,5 s) | "Necesita mejorar" 2 informes seguidos |
| Fallos de build en producción | 0 | cualquier fallo en `main` |

### Health check
NOT APPLICABLE — no hay servidor. La comprobación equivalente es que `/` responda 200 (monitor opcional).

### Cost model
| Service | Free tier | Cost at launch | Cost at 10× | Cliff to watch |
|---|---|---|---|---|
| Cloudflare Pages | Plan gratuito (límites exactos **no verificados**: consultar la página de precios de Cloudflare) | $0 | $0 (ancho de banda de estáticos) | Número de compilaciones al mes del plan gratuito |
| Dominio propio | — | Lo que cobre el registrador (opcional) | igual | Renovación anual |

**Coste mensual estimado en el lanzamiento: $0** (más el dominio si se compra). La mayor partida posible es el dominio; la palanca más barata es usar el subdominio `pages.dev`.

---

## 17. Model Routing

NOT APPLICABLE — this project does not call an LLM at runtime.

---

## 18. Skills to Use During Build

| Skill | Build steps | Why | Install |
|---|---|---|---|
| `ui-ux-pro-max` (se activa solo, sin barra) | 2 | Validar paleta, escala tipográfica y estilo de componente de §7 antes de aplicarlos | `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill` y luego `/plugin install ui-ux-pro-max@ui-ux-pro-max-skill` |
| `frontend-design` (se activa solo) | 2, 4, 8 | Calidad del marcado y la composición de las páginas | `/plugin marketplace add anthropics/skills` y luego `/plugin install example-skills@anthropic-agent-skills` |
| `playwright-cli` (se activa solo) | 7, 10 | Inspeccionar el DOM real de Pagefind y depurar los tests e2e | `npm install -g @playwright/cli@latest` y luego `playwright-cli install --skills` |
| `/claude-seo-ai:audit` | 11 (antes de lanzar) | Auditoría SEO y de visibilidad en buscadores con IA del sitio ya desplegado en preview | `/plugin marketplace add Hainrixz/claude-seo-ai`, `/plugin install claude-seo-ai@claude-seo-ai` y `/reload-plugins` |

Ninguna es obligatoria: si falta una, el builder sigue las instrucciones de este blueprint, anota el respaldo en una línea y continúa.

---

## 19. Agent Workspace

Modo archivo único: cada artefacto se emite como bloque de código con su ruta de destino. **Escríbelos todos antes de Bootstrap.** La copia "segura de repetir" no aplica porque no existe una carpeta `workspace/` que copiar: se escriben una sola vez.

### 19.1 `CLAUDE.md`
Ruta: `CLAUDE.md`

````markdown
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
````

### 19.2 `AGENTS.md`
Ruta: `AGENTS.md`

````markdown
# AGENTS.md

Jerga Viva: diccionario estático de jerga moderna en español (Astro + Tailwind + Pagefind).
La fuente de verdad de las instrucciones es `CLAUDE.md`; este archivo es un resumen.

Comandos: `npm run check`, `npm run lint`, `npm test`, `npm run build`, `node scripts/check-dist.mjs --full`, `npm run test:e2e`.

Tres reglas clave:
1. Todo el contenido vive en `src/data/words.json` y se valida con `src/lib/word-schema.ts`.
2. No se añade nada fuera de alcance (cuentas, envío de palabras, imágenes OG, multi-idioma).
3. Cada paso termina con `npm run format`, sus comprobaciones en verde y un `git tag step-NN-slug`.
````

### 19.3 `.claude/settings.json`
Ruta: `.claude/settings.json`

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run:*)",
      "Bash(npm test:*)",
      "Bash(npm install)",
      "Bash(npm ci)",
      "Bash(npm audit:*)",
      "Bash(npx playwright:*)",
      "Bash(npx vitest:*)",
      "Bash(npx biome:*)",
      "Bash(EXPECT_CATEGORIES=redes-sociales,gen-z npx vitest run tests/unit/coverage.test.ts)",
      "Bash(EXPECT_CATEGORIES=redes-sociales,gen-z,internet-gaming,relaciones-actitudes npx vitest run tests/unit/coverage.test.ts)",
      "Bash(SITE_URL=https://example.test npm run build)",
      "Bash(node scripts/check-dist.mjs:*)",
      "Bash(node -v)",
      "Bash(grep:*)",
      "Bash(test:*)",
      "Bash(ls:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git tag:*)",
      "Bash(git init:*)",
      "Bash(git config:*)",
      "Bash(git rev-parse:*)",
      "Bash(git ls-files:*)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Bash(git push:*)",
      "Bash(rm -rf:*)"
    ]
  }
}
```

### 19.4 Project skills

| Skill | Triggers on | What it automates |
|---|---|---|
| `add-word` | "añadir una palabra", "nueva entrada" | Añade una entrada válida a `words.json` y a la lista de titulares |
| `release-check` | "antes de desplegar", "compuerta final" | Ejecuta la compuerta global de §20.1 |

Ruta: `.claude/skills/add-word/SKILL.md`
````markdown
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
````

Ruta: `.claude/skills/release-check/SKILL.md`
````markdown
---
name: release-check
description: Ejecuta la compuerta final de Jerga Viva antes de desplegar. Úsalo cuando pidan comprobar todo, revisar antes de desplegar o correr la compuerta final.
---

# Compuerta final

## When to use
Antes de fusionar a `main` o de desplegar.

## Steps
1. Ejecuta el bloque de verificación de abajo en orden.
2. Si algo falla, corrige la causa; no relajes un test.

## Verify
```bash
npm ci                                  # expect: exit 0
npm run check                           # expect: exit 0
npm run lint                            # expect: exit 0
npm test                                # expect: exit 0, 0 failed, 0 skipped
npm run build                           # expect: exit 0
node scripts/check-dist.mjs --full      # expect: exit 0
npm run test:e2e                        # expect: exit 0, 0 failed
```

## Do not
- No omitas los e2e porque "solo cambió contenido".
````

### 19.5 `.claude/rules/*.md`

| File | `paths` globs | Covers |
|---|---|---|
| `.claude/rules/content.md` | `src/data/**`, `tests/fixtures/**` | Contrato de redacción y esquema |
| `.claude/rules/astro-pages.md` | `src/pages/**`, `src/layouts/**`, `src/components/**` | Convenciones de páginas |

Ruta: `.claude/rules/content.md`
````markdown
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
````

Ruta: `.claude/rules/astro-pages.md`
````markdown
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
````

### 19.6 Verify-critical config and local infrastructure

Cada archivo se escribe con exactamente este contenido, en la ruta indicada, **antes de Bootstrap**.

Ruta: `package.json`
```json
{
  "name": "jerga-viva",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=24.0.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "lint": "biome check .",
    "format": "biome check --write .",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "audit:dist": "node scripts/check-dist.mjs --full"
  },
  "dependencies": {
    "@astrojs/sitemap": "3.7.4",
    "@tailwindcss/vite": "4.3.3",
    "astro": "7.3.5",
    "astro-pagefind": "2.0.1",
    "tailwindcss": "4.3.3"
  },
  "devDependencies": {
    "@astrojs/check": "0.9.10",
    "@axe-core/playwright": "4.13.0",
    "@biomejs/biome": "2.5.15",
    "@playwright/test": "1.63.0",
    "@types/node": "26.6.4",
    "typescript": "6.0.3",
    "vitest": "5.0.3"
  }
}
```

Ruta: `astro.config.mjs` (el paso 7 hace exactamente dos ediciones: añadir `import pagefind from "astro-pagefind";` y añadir `pagefind()` al arreglo `integrations`)
```js
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.SITE_URL ?? "https://jerga-viva.pages.dev",
  trailingSlash: "always",
  integrations: [sitemap({ filter: (page) => !page.includes("/404") })],
  vite: { plugins: [tailwindcss()] },
});
```

Ruta: `tsconfig.json`
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*", "tests/**/*", "*.ts", "*.mjs"],
  "exclude": ["dist", "blueprints", "node_modules"]
}
```

Ruta: `biome.json` (solo `.ts`/`.mjs`: no procesa `.css`, `.astro` ni `.json`, así que no choca con la sintaxis de Tailwind)
```json
{
  "$schema": "https://biomejs.dev/schemas/2.5.15/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": {
    "includes": [
      "src/**/*.ts",
      "tests/**/*.ts",
      "scripts/**/*.mjs",
      "*.ts",
      "*.mjs",
      "!**/blueprints",
      "!**/dist",
      "!**/.astro"
    ]
  },
  "formatter": { "enabled": true, "indentStyle": "space", "indentWidth": 2, "lineWidth": 100 },
  "linter": { "enabled": true, "rules": { "recommended": true } },
  "javascript": { "formatter": { "quoteStyle": "double" } }
}
```

Ruta: `vitest.config.ts`
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
});
```

Ruta: `playwright.config.ts`
```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:4321" },
  webServer: {
    command: "npm run preview -- --port 4321 --host 127.0.0.1",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: false,
    timeout: 60_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
});
```
Los e2e prueban el contenido de `dist/` servido por `astro preview`: **ejecuta `npm run build` antes de `playwright test`**.

Ruta: `.gitignore`
```
node_modules/
dist/
.astro/
.env
.env.*
!.env.example
playwright-report/
test-results/
```

Ruta: `.nvmrc`
```
24
```

Ruta: `.env.example`
```
SITE_URL=https://jerga-viva.pages.dev
```

Ruta: `public/favicon.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#5B2EFF"/><text x="32" y="45" font-size="40" font-weight="700" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif">J</text></svg>
```

| File | Path in the project | Which `Verify` commands need it | Resolution/env handling it carries | Bundle-path exclusion |
|---|---|---|---|---|
| package.json | `package.json` | todos | manifiesto con scripts y versiones exactas | n/a — no recorre el árbol |
| astro.config.mjs | `astro.config.mjs` | pasos 1–11 | lee `SITE_URL` de `process.env` (no carga `.env`; se exporta en el comando) | n/a |
| tsconfig.json | `tsconfig.json` | pasos 1–11 (`npm run check`) | `extends astro/tsconfigs/strict` | `"exclude": ["dist", "blueprints", "node_modules"]` |
| biome.json | `biome.json` | pasos 1–11 (`npm run lint`) | solo `.ts`/`.mjs` | `"!**/blueprints"`, `"!**/dist"`, `"!**/.astro"` |
| vitest.config.ts | `vitest.config.ts` | pasos 3, 5, 6, 8 | `include: tests/unit/**/*.test.ts`; `astro/zod` se resuelve como paquete normal en Node | `include` solo `tests/unit/**`, no recorre `blueprints/` |
| playwright.config.ts | `playwright.config.ts` | pasos 1, 7, 8, 10, 11 | `webServer` con `astro preview` en el puerto 4321 | `testDir: tests/e2e` solo |
| .gitignore | `.gitignore` | Bootstrap | excepción `!.env.example` colocada después de `.env.*` | n/a |
| .env.example, .nvmrc, favicon.svg | raíz / `public/` | paso 9 (`SITE_URL`), Bootstrap | — | n/a |

#### Resolution convention matrix

**The convention, stated once:** los imports relativos entre archivos `.ts` (en `src/` y `tests/`) **no llevan extensión** (`../../src/lib/text`); los imports de componentes `.astro` conservan `.astro`. `scripts/check-dist.mjs` es JavaScript plano y solo importa módulos integrados `node:*` (nunca importa nada de `src/`).

| Context | Command that exercises it | Convention as it appears there | Config + literal setting that makes it work |
|---|---|---|---|
| Application source | `npm run build` | `import { slugify } from "../lib/text";` | `tsconfig.json` `"extends": "astro/tsconfigs/strict"` (moduleResolution de bundler heredado de la config base de Astro; se confirma con `npm run check` en el paso 1) |
| Test files | `npm test` | `import { slugify } from "../../src/lib/text";` | Vitest usa Vite para resolver; `vitest.config.ts` `include` |
| Standalone scripts | `node scripts/check-dist.mjs` | solo `import ... from "node:fs"` / `"node:path"` | n/a — no importa código del proyecto, por eso no hay conflicto de extensión |
| Build / bundle | `npm run build` | igual que Application source | Vite (dentro de Astro) |
| Typecheck | `npm run check` | igual que Application source | `tsconfig.json` |

#### Cross-artifact value reconciliation

| Shared value | Single source — the file that decides it | Literal value | Every other place it appears | Compared |
|---|---|---|---|---|
| URL por defecto del sitio | `src/lib/site.ts` — `SITE_FALLBACK_URL` | `https://jerga-viva.pages.dev` | `astro.config.mjs` — `site` · `.env.example` · `src/pages/robots.txt.ts` (paso 9) · §12 · paso 9 Verify | yes |
| Directorio de salida | Astro (por defecto) | `dist` | `.gitignore` · `biome.json` (`!**/dist`) · `tsconfig.json` (`exclude`) · `scripts/check-dist.mjs` (`DIST`) · §12 Cloudflare · README (paso 11) | yes |
| Puerto de `preview` | `playwright.config.ts` | `4321` | `webServer.command` · `webServer.url` · `use.baseURL` (los tres en el mismo archivo) | yes |
| Ruta del contenido | `src/content.config.ts` — `file()` | `src/data/words.json` | `scripts/check-dist.mjs` · `tests/unit/coverage.test.ts` · `tests/unit/lib.test.ts` · pasos 3, 5, 6 · CLAUDE.md | yes |
| Ruta de la lista de titulares | `tests/fixtures/headwords.json` | `tests/fixtures/headwords.json` | `tests/unit/coverage.test.ts` · pasos 5, 6 · regla `content.md` | yes |
| Categorías (4 ids) | `src/lib/word-schema.ts` — `CATEGORIES` | `redes-sociales`, `gen-z`, `internet-gaming`, `relaciones-actitudes` | `tests/fixtures/headwords.json` (claves) · rutas `/categoria/<id>/` · `tests/e2e/home.spec.ts` · allowlist de `.claude/settings.json` | yes |
| Ruta de la carpeta del blueprint | n/a | `blueprints` | `biome.json` · `tsconfig.json` | yes |
| Selector de búsqueda | Pagefind (DOM real) | `.pagefind-ui__search-input`, `.pagefind-ui__result-link` | `tests/e2e/search.spec.ts` · `tests/e2e/keyboard.spec.ts` | **no — no verificado contra el DOM real** (ver paso 7 y riesgo en §20.2) |

#### Byte-exact artifact reconciliation
NOT APPLICABLE — this blueprint authors no byte-exact expected output. Los tests comprueban propiedades (ids, esquemas, URLs, estados HTTP), nunca comparan un archivo contra un literal.

---

## 20. Acceptance Gate, Risks & Decision Log

### 20.1 Global acceptance gate

El proyecto está **terminado** cuando cada comando de abajo termina con exit 0 en un clon limpio, y no antes.

```bash
npm ci                                  # expect: exit 0
npm run check                           # expect: exit 0, zero errors
npm run lint                            # expect: exit 0, zero diagnostics
npm test                                # expect: exit 0, 0 failed, 0 skipped
npm run build                           # expect: exit 0
node scripts/check-dist.mjs --full      # expect: exit 0 — el artefacto dist/ tiene una página por entrada, sitemap, llms.txt, robots, índice de búsqueda
npm run test:e2e                        # expect: exit 0, 0 failed (incluye axe en claro y oscuro, teclado y responsive)
```

Las expectativas son propiedades, no recuentos. Ninguna línea acepta "sale distinto de cero" como éxito.

Más estas comprobaciones manuales, una vez antes del lanzamiento:

- [ ] `git tag -l 'step-*'` lista una etiqueta por cada paso de §9 (11 etiquetas, de `step-01-base` a `step-11-final`).
- [ ] `git ls-files --error-unmatch <ruta>` termina con 0 para cada archivo de la tabla "Files that must be committed" de §10 (una ruta por invocación) y `git check-ignore -q .env.example; test $? -eq 1` (no está ignorado).
- [ ] `.gitignore` apareció en el commit de Bootstrap, no en un paso (`git log --diff-filter=A --format=%H -- .gitignore` muestra el primer commit).
- [ ] Bootstrap (§10) se ejecutó una segunda vez sobre el árbol ya construido, terminó con exit 0 y no cambió el `package.json`.
- [ ] Todas las filas de "Cross-artifact value reconciliation" dicen `Compared: yes` — **salvo la de los selectores de Pagefind, que el paso 7 debe confirmar contra el DOM real y actualizar a `yes`**.
- [ ] Todo lo que está en la tabla Non-Goals de §1 sigue sin construirse.
- [ ] `npm audit --omit=dev --audit-level=high; test $? -eq 0` (si falla, decidir y anotar en el registro de decisiones).
- [ ] Recorrido solo con teclado y una pasada con lector de pantalla por una palabra y la búsqueda (§15).
- [ ] Una persona revisó al menos una muestra de las definiciones (§20.2, riesgo 1).
- [ ] `SITE_URL` está definida en Cloudflare Pages y `https://<url>/sitemap-index.xml` responde 200.

**No se ignoran las advertencias.** Una advertencia tolerada se vuelve permanente.

### 20.2 Risk register

| Risk | Likelihood | Impact | Early signal | Mitigation |
|---|---|---|---|---|
| **Definiciones inexactas o desactualizadas** (las redacta una IA y la jerga cambia rápido) | H | H | Lectores nativos señalan errores; definiciones genéricas | La página `/acerca/` lo declara; `reviewedAt` permite marcar lo revisado; antes de lanzar, una persona revisa una muestra y ajusta la política; el contrato de §4 prohíbe inventar orígenes |
| **Los selectores o la API del componente de Pagefind no coinciden con la realidad** (la sintaxis viene de un README resumido y no se pudo probar sin Node) | M | M | `npm run check` rechaza las props; `search.spec.ts` no encuentra `.pagefind-ui__search-input` | El paso 7 manda leer `node_modules/astro-pagefind/README.md` y ajustar **el selector o las props**, nunca el criterio; la tabla de reconciliación lo marca "no verificado" |
| **Este blueprint no se pudo ejecutar de punta a punta antes de entregarlo** (Node no está instalado en la máquina de diseño) | H | M | Un comando del Bootstrap o del paso 1 falla en el primer intento | Cada fallo se corrige en el paso donde aparece y se anota en §20.3; el builder no avanza con un gate en rojo |
| **APIs o comportamientos de Astro 7 / Tailwind 4 / Biome 2.5 distintos de lo asumido** (`file()` loader, `@theme inline`, `files.includes` de Biome) | M | M | `npm run check`/`npm run build`/`npm run lint` fallan en el paso 1–3 | Consultar la documentación oficial del paquete concreto y corregir el archivo emitido; si la corrección cambia un pin o una convención, anotarlo en §20.3 |
| **Contenido flojo para SEO**: definiciones muy parecidas entre sí o demasiado cortas | M | M | Pocas páginas indexadas a las 8 semanas | Ejemplos y origen únicos por entrada (el esquema lo exige); revisar las páginas "Descubierta, actualmente sin indexar" en Search Console y enriquecer esas entradas |
| **Términos ofensivos o vulgares** generan reputación o reportes | M | M | Quejas o reportes | Etiqueta `sensitivity` visible, política en `/acerca/` y regla de no definir insultos dirigidos a grupos protegidos |
| **Las versiones `latest` cambian** entre el diseño y la construcción | M | L | `npm install` instala otras; peers rotos | `package.json` fija versiones exactas; si una ya no existe, usar la más reciente del mismo major y anotarlo en §20.3 |
| **Alcance**: añadir "solo una función" (comentarios, votos, cuentas) antes de lanzar | M | H | Peticiones de añadir usuarios o formularios | La tabla Non-Goals de §1 y la regla 1 de `CLAUDE.md`; esas funciones son otro proyecto |

### 20.3 Decision log

| # | Decision | Rejected alternative | Why | Would reverse if |
|---|---|---|---|---|
| 1 | Forma `marketing-site` (directorio) sin cuentas | `content-community-platform` (usuarios envían palabras) | ~5× el trabajo y exige moderación; el usuario pidió que las palabras las pusiera el asistente | Hay demanda real de contribuir y capacidad para moderar |
| 2 | Contenido en un único JSON versionado | Base de datos o CMS | 100 entradas, un editor, cero servidores | Más de un editor no técnico, o miles de entradas |
| 3 | Astro | Next.js | Sitio estático sin estado; cero JS por defecto | Aparece una función con estado de cliente complejo |
| 4 | Pagefind | Algolia/Meilisearch | Índice estático, sin servicio ni coste | Se necesita búsqueda con tolerancia a errores o analítica de consultas |
| 5 | npm | pnpm | pnpm no se pudo probar y npm ya viene con Node | Se necesitan workspaces o instalaciones más rápidas |
| 6 | TypeScript 6.0.3 | TypeScript 7.0.2 | Astro declara `^6.0.3` | Astro soporta TS 7 oficialmente |
| 7 | Fuentes del sistema | Fuente propia autoalojada | Cero peticiones y cero CLS; v1 es un prototipo | El diseño exige una identidad tipográfica propia |
| 8 | Sin imagen OG por palabra | `satori` + `resvg` | No se podía probar la generación de imágenes ni las tipografías empaquetadas | Los enlaces compartidos en redes son el canal principal |
| 9 | Sin CSP en `_headers` | CSP estricta | Pagefind usa WebAssembly y Astro inserta scripts en línea; no se podía probar | Hay un entorno de prueba para ajustar la CSP sin romper la búsqueda |
| 10 | Sin pipeline de CI propio | GitHub Actions | Las versiones de las acciones no se verificaron en vivo | Colaboran varias personas |
| 11 | Biome solo sobre `.ts`/`.mjs` | Biome sobre CSS y JSON | Evita el fallo de parseo de las directivas de Tailwind 4 y diferencias de formato en JSON | Se añade una regla que solo Biome pueda aplicar a CSS |
| 12 | "Palabra del día" calculada en el cliente con la fecha UTC | Reconstruir el sitio cada día | Sin servidor ni cron; si no hay JS se ve la palabra elegida en el build | Se necesita que todos los usuarios vean la misma palabra con zona horaria local |
| 13 | Excluir `.pagefind-ui` de axe | Auditar el widget completo | Es marcado de terceros que no controlamos; el teclado sí se prueba | Pagefind corrige su marcado o se reemplaza el widget por uno propio |
| 14 | Nombre provisional "Jerga Viva" | Esperar a elegir nombre | El usuario delegó la decisión y vive en una sola constante | El usuario elige otro nombre |

### 20.4 What to build next

1. **Enviar palabras con moderación** — disparador: más de 1.000 visitas diarias sostenidas y demanda de contribuir.
2. **Imagen de vista previa por palabra** — disparador: los enlaces compartidos en redes superan al tráfico de buscadores.
3. **Revisión humana y marca "Revisada el …"** — disparador: antes del lanzamiento público o tras los primeros reportes.
4. **Variantes por país** (por ejemplo español dominicano) — disparador: el contenido en español general está completo y revisado.
5. **Analítica sin cookies** (Cloudflare Web Analytics) — disparador: se quiere saber qué palabras se leen más.

---

*End of blueprint. Build order is §9. Stop when §20.1 is green.*
