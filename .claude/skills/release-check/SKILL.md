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
