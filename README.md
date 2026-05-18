# SOUNDCHECK_POCKET

**Sonidista virtual de bolsillo** — app móvil que guía una prueba de sonido ordenada para bandas emergentes: selección de instrumentos, calibración, prueba individual, comparación, mezcla completa y checklist final.

> *Tu prueba de sonido guiada en el bolsillo.*

## Documentación

| Recurso | Uso |
|---------|-----|
| [docs/PRODUCT.md](docs/PRODUCT.md) | Especificación de producto (fuente interna) |
| [docs/SECURITY-SUPPLY-CHAIN.md](docs/SECURITY-SUPPLY-CHAIN.md) | Controles npm / agentes IA (axios, Mini Shai-Hulud) |
| [AGENTS.md](AGENTS.md) | Guía para agentes de código |
| `.cursor/rules/` | Reglas Cursor persistentes |
| `.cursor/skills/soundcheck-pocket/` | Skill de implementación |

Concepto original: [Google Doc](https://docs.google.com/document/d/1HY32AGhgQoCMxM4YiTxbzuVx777Vy5GX/edit).

## Desarrollo

```bash
corepack enable
pnpm install
pnpm run security:audit
pnpm start
```

Expo SDK 55 — [documentación](https://docs.expo.dev/versions/v55.0.0/).
