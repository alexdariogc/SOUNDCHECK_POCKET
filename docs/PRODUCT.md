# Sonidista Virtual de Bolsillo — especificación de producto

Fuente: [Concepto Sonidista Virtual Bolsillo](https://docs.google.com/document/d/1HY32AGhgQoCMxM4YiTxbzuVx777Vy5GX/edit) (resumen interno para el repo).

## Qué es

App móvil **asistente guiado de prueba de sonido** para bandas emergentes (especialmente Latinoamérica) sin sonidista en cada show. **No reemplaza** a un ingeniero profesional: ayuda a una mezcla base aceptable, evita errores comunes y da seguridad antes del show.

**Promesa:** *Tu prueba de sonido guiada en el bolsillo.*

**No prometer:** mezcla automática en tiempo real de toda la banda.

**Sí prometer:** prueba de sonido ordenada, instrumento por instrumento, con recomendaciones simples para no sonar mal en vivo.

## Problemas que resuelve

- Voz poco entendible, bajo muy fuerte, teclados/guitarras tapando la voz
- Mezcla saturada, exceso de graves, feedback
- Sin proceso ordenado de soundcheck; dependencia de “suerte” o criterio improvisado

## Enfoque técnico clave

- Entrada desde **salida de consola** (estéreo), no adivinar todo desde la mezcla completa al inicio.
- **Referencias por instrumento** (cada uno probado solo) → comparación entre fuentes → **mezcla completa** vs referencias.
- Con solo estéreo de consola **no** se puede decir “baja exactamente el canal 5”. Recomendaciones **honestas y accionables** en lenguaje de músico/consola.

## Flujo de uso (6 pasos)

1. **Selección de instrumentos** — arma la prueba personalizada.
2. **Calibración de entrada** — consola → teléfono; validar señal usable.
3. **Prueba individual** — un instrumento a la vez (ej. 10 s voz al máximo).
4. **Comparación entre instrumentos** — niveles y rangos antes del full band.
5. **Prueba banda completa** — sección intensa (ej. 30 s coro).
6. **Checklist final** — resumen + recomendaciones priorizadas.

## Instrumentos soportados (catálogo)

Voz principal, coros, bajo, guitarra, teclado/sintetizador, batería acústica, batería electrónica, pistas/secuencias, percusión, vientos.

## Calibración — qué detectar

- Señal muy baja / muy alta, clipping, ruido excesivo, saturación de entrada del teléfono.
- Fuentes de consola: REC OUT, AUX OUT, MONITOR OUT, MAIN OUT (nivel controlado).
- Mensajes en lenguaje claro (ej. “Baja un poco la salida de la consola…”).

## Análisis por instrumento

Métricas: nivel promedio, picos, saturación, exceso graves/agudos, claridad, posible competencia con otros.

Recomendaciones simples (ej. filtro HPF en voz, bajar graves en consola).

## Análisis mezcla completa

Voz tapada, exceso graves, opaca/chillona, saturación master, competencia en mismo rango, riesgo de feedback. Cruzar con referencias individuales para atribuir candidatos (ej. bajo + teclado en graves).

## Modos de captura

| Modo | Fuente | Ventaja | Limitación |
|------|--------|---------|------------|
| Consola | Salida consola | Señal más limpia | No es exactamente lo que oye el público |
| Sala | Micrófono del teléfono en público | Más cercano a la audiencia | Ruido, posición, acústica |
| Híbrido | Consola + validación en sala | Más útil en vivo | Más pasos para el usuario |

## MVP (primera versión)

- Entrada audio desde consola
- Calibración de nivel, detector de clipping, analizador de espectro básico
- Prueba guiada por instrumento, comparación entre instrumentos, prueba mezcla completa
- Checklist final, recomendaciones en lenguaje humano
- Guardado de configuraciones por banda/lugar
- Modo rápido de soundcheck

## Motor de recomendaciones (v1)

**Sin depender de IA avanzada.** Reglas sobre: RMS/nivel, picos, clipping, análisis de frecuencias, comparación de rangos, umbrales por tipo de instrumento, reglas básicas de mezcla.

IA posterior (opcional): voz enterrada, estilos, copy más natural, aprendizaje, separación parcial de fuentes, adaptación por género.

## Perfiles de estilo (post-MVP / configuración)

Rock, pop, post-punk, darkwave, metal, funk, cumbia, salsa, acústico, electrónica. Prioridad al frente: voz, bajo, guitarra, teclados, secuencias, batería. Ejemplo: post-punk/darkwave → prioridad voz + bajo + sintes, sensación oscura y clara.

## Hardware / conexión

Portable: sin laptop. Cable consola → teléfono, adaptador USB-C/Lightning, interfaz pequeña; futuro: interfaz multicanal. La app debe **explicar** conexión sin saturar ni dañar la entrada.

## Nombres de producto (referencia)

Soundcheck Pocket, Sonidista de Bolsillo, BandCheck, StageCheck, etc. Repo: `soundcheck-pocket`.

## Valor

Tranquilidad, orden y criterio básico — no “mezcla perfecta”.
