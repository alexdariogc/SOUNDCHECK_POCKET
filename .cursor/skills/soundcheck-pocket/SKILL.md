---
name: soundcheck-pocket
description: Implementa features de Soundcheck Pocket (sonidista virtual): flujo de 6 pasos, calibración consola→teléfono, pruebas por instrumento, análisis RMS/clipping/espectro, comparación, checklist y copy para músicos. Usar al diseñar pantallas, audio, reglas de mezcla, recomendaciones o MVP de la app SOUNDCHECK_POCKET.
---

# Soundcheck Pocket — implementación

## Antes de codificar

1. Leer [docs/PRODUCT.md](../../../docs/PRODUCT.md) si el cambio toca producto o flujo.
2. Respetar reglas en `.cursor/rules/` (visión, flujo, audio, copy, Expo 55).
3. Confirmar en qué **paso del flujo** (1–6) encaja el cambio.

## Principios

- **Referencias individuales primero**, mezcla completa después.
- **Reglas deterministas** en v1; IA solo si el usuario lo pide explícitamente.
- Recomendaciones **honestas** (estéreo de consola ≠ control por canal exacto).
- **Código en inglés**; strings de UI en `src/i18n/` (`t('key')`), copy español en `locales/es.ts`.

## Checklist por feature

```
- [ ] ¿Encaja en el paso 1–6 sin romper el orden?
- [ ] ¿Persiste datos de sesión necesarios para pasos posteriores?
- [ ] ¿UI vía i18n (`t()`), sin strings hardcodeados en JSX?
- [ ] ¿Modo consola/sala/híbrido considerado si aplica?
- [ ] ¿APIs Expo 55 verificadas en docs?
```

## Estructura de código sugerida

```
src/
  domain/       # Instrument, Session, Reference, ChecklistItem
  audio/        # capture, calibration, analysis (RMS, peak, clip, spectrum)
  rules/        # thresholds por instrumento, comparación, recomendaciones
  features/     # pantallas por paso del flujo
  storage/      # presets banda/lugar (post-MVP si no es crítico)
```

Ajustar a lo existente en el repo; no reestructurar masivamente sin pedido.

## Implementar un paso nuevo

| Paso | Entregables mínimos |
|------|---------------------|
| 1 Instrumentos | catálogo fijo, multi-select, orden de prueba |
| 2 Calibración | medidor entrada, estados señal, copy de conexión hardware |
| 3 Individual | timer/prompt, captura, `InstrumentReference` |
| 4 Comparación | diff niveles/bandas entre referencias |
| 5 Full band | captura + diff vs referencias + atribución candidatos |
| 6 Checklist | plantilla resumen + acciones numeradas |

## Detalle extendido

- Umbrales, plantillas de mensajes, catálogo instrumentos: [reference.md](reference.md)
- Especificación producto: [docs/PRODUCT.md](../../../docs/PRODUCT.md)
