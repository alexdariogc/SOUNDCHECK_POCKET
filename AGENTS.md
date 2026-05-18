# SOUNDCHECK_POCKET — guía para agentes

## Producto

**Sonidista virtual de bolsillo**: asistente guiado de prueba de sonido para bandas emergentes. Especificación completa en [docs/PRODUCT.md](docs/PRODUCT.md). Reglas en `.cursor/rules/`. Skill de implementación: `.cursor/skills/soundcheck-pocket/`.

**Promesa:** guía ordenada instrumento por instrumento — **no** mezcla automática mágica en tiempo real.

## Stack

- Expo SDK **55** — leer [docs Expo v55](https://docs.expo.dev/versions/v55.0.0/) antes de escribir código nativo/Expo.
- React Native + TypeScript (`strict`).

## Flujo obligatorio de la app

1. Selección de instrumentos → 2. Calibración entrada → 3. Prueba individual → 4. Comparación entre instrumentos → 5. Mezcla completa → 6. Checklist final.

No implementar features que salten pasos sin justificación explícita del usuario.

## Recomendaciones al usuario

- Lenguaje simple para músicos (consola, graves, voz tapada).
- Nunca fingir precisión de canal exacto con solo entrada estéreo.
- Atribuir problemas cruzando referencias individuales + mezcla completa.

## MVP v1

Reglas basadas en señal (RMS, picos, clipping, espectro, umbrales por instrumento). IA avanzada es **post-MVP** salvo que el usuario pida lo contrario.
