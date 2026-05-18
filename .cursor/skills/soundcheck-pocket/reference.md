# Referencia — Soundcheck Pocket

## Catálogo de instrumentos (ids en código)

`voice` · `backing_vocals` · `bass` · `guitar` · `keys` · `acoustic_drums` · `electronic_drums` · `tracks` · `percussion` · `winds`

Labels en `src/i18n/locales/` (`instruments.items.*`).

Cada tipo puede tener umbrales distintos en `rules/` (graves esperados, headroom, prioridad en mezcla).

## Conexión hardware (copy)

- Salidas típicas: REC OUT, AUX OUT, MONITOR OUT, MAIN OUT (bajo nivel).
- Cable consola → adaptador USB-C/Lightning o interfaz compacta.
- Advertencia: saturar la entrada del teléfono daña la calibración y el análisis.

## Calibración — mensajes ejemplo

| Condición | Mensaje orientativo |
|-----------|---------------------|
| Señal OK | Señal detectada. Puedes continuar con la prueba. |
| Muy alta / clip | Baja un poco la salida de la consola; está entrando muy fuerte al teléfono. |
| Muy baja | Sube la salida de la consola o revisa el cable. |
| Ruido | Hay mucho ruido en la entrada; revisa cable y tierra. |

## Prueba individual — prompt ejemplo

> Ahora prueba **{instrumento}**. {instrucción específica} durante **{N}** segundos.

Ej. voz: “Canta la parte más fuerte del show”. Bajo: “Toca la línea más fuerte”.

## Métricas por referencia

- `avgLevel`, `peakLevel`, `clipping`, `lowBandEnergy`, `highBandEnergy`, `clarityScore` (heurística v1)
- `competitionHints[]` — bandas que chocan con otros instrumentos ya medidos

## Comparación entre instrumentos (paso 4)

Generar filas tipo: instrumento · nivel relativo · nota (ej. “demasiado fuerte en graves”, “ocupa medios-graves”).

## Mezcla completa — detecciones

Voz tapada · exceso graves · opaca · chillona · master saturado · competencia de rango · riesgo feedback.

Atribución: listar 1–2 candidatos desde referencias individuales, orden de acción sugerido.

## Plantilla checklist final

```markdown
## Soundcheck final

- Entrada al teléfono: {ok|revisar}
- Master sin clipping: {ok|revisar}
- {Instrumento}: {ok|revisar|nota}
- Mezcla completa: {aceptable|revisar}
- Voz entendible: {alta|media|baja}
- Riesgo de feedback: {bajo|medio|alto}

### Recomendaciones
1. ...
2. ...
```

## Perfiles de estilo (configuración futura)

Géneros: rock, pop, post-punk, darkwave, metal, funk, cumbia, salsa, acústico, electrónica.

`priorityFront`: voz | bajo | guitarra | teclados | secuencias | bateria — ajusta peso de reglas, no sustituye mediciones.

## MVP vs después

| MVP | Después |
|-----|---------|
| Reglas RMS/clip/espectro | IA para voz enterrada, estilo, copy natural |
| Estéreo consola | Interfaz multicanal |
| Presets banda/lugar | Aprendizaje entre shows |
| Modo rápido | Separación parcial de fuentes en mezcla |

## Anti-patrones de implementación

- Analizar mezcla completa sin referencias individuales previas.
- Prometer auto-mezcla o control exacto de canal.
- Recomendaciones solo en dB sin acción en consola.
- Omitar explicación de limitación modo sala vs consola.
