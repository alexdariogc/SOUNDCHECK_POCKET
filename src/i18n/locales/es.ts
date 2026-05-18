const es = {
  common: {
    continue: 'Continuar',
    back: 'Volver',
    comingSoon: 'Próximamente en esta versión.',
  },
  steps: {
    instruments: 'Instrumentos',
    calibration: 'Calibración',
    individual: 'Prueba individual',
    comparison: 'Comparación',
    fullBand: 'Banda completa',
    checklist: 'Checklist final',
    badge: 'Paso {{current}} de {{total}} · {{name}}',
  },
  instruments: {
    selectTitle: '¿Qué instrumentos usarán?',
    selectSubtitle:
      'Elige todos los que sonarán en el show. El orden define cómo los guiaremos en la prueba individual.',
    catalogSection: 'Catálogo',
    orderSection: 'Orden de prueba',
    orderHint: 'Probaremos uno por uno en este orden. Usa las flechas para ajustar.',
    continue_zero: 'Selecciona al menos un instrumento',
    continue_one: 'Continuar con {{count}} instrumento',
    continue_other: 'Continuar con {{count}} instrumentos',
    moveUpA11y: 'Subir {{name}}',
    moveDownA11y: 'Bajar {{name}}',
    items: {
      voice: 'Voz principal',
      backing_vocals: 'Coros',
      bass: 'Bajo',
      guitar: 'Guitarra',
      keys: 'Teclado / sintetizador',
      acoustic_drums: 'Batería acústica',
      electronic_drums: 'Batería electrónica',
      tracks: 'Pistas / secuencias',
      percussion: 'Percusión',
      winds: 'Vientos',
    },
    hints: {
      voice: 'Canta la parte más fuerte del show',
    },
  },
  calibration: {
    title: 'Calibración de entrada',
    subtitle:
      'Conecta la consola solo por jack 3,5 mm (TRRS) o interfaz USB-C. No usamos el micrófono del teléfono.',
    connectionTitle: 'Conexión recomendada',
    connectionBody:
      'Conecta la salida de la consola al jack TRRS (3,5 mm) o a una interfaz USB-C. Usa un cable que no sature la entrada. Empieza con el volumen de consola bajo y sube poco a poco.',
    sources: {
      recOut: 'REC OUT / grabación',
      auxOut: 'AUX OUT (nivel controlado)',
      monitorOut: 'MONITOR OUT',
      mainOut: 'MAIN OUT (con cuidado — suele ir muy fuerte)',
    },
    meterTitle: 'Nivel de entrada',
    listening: 'Escuchando señal… Haz sonar la consola.',
    startListening: 'Escuchar señal',
    stopListening: 'Detener',
    startHint:
      'Con el cable o interfaz conectados, haz sonar la consola (ruido rosa, música suave o un instrumento).',
    checkConnection: 'Verificar conexión',
    checkingConnection: 'Comprobando entradas que reporta el teléfono…',
    verifyingSilence:
      'Paso 1: midiendo ~3 s. Laptop en silencio, sin música ni ruido rosa.',
    verifyingSignal: 'Paso 2: midiendo ~3 s. Reproduce ruido rosa en la laptop.',
    externalInputRequired:
      'Conecta la salida de la consola al jack 3,5 mm (TRRS) o a una interfaz USB-C. El micrófono del teléfono no se usa en esta app.',
    prepTitle: 'Antes de calibrar (importante en Android)',
    prepBody:
      'El teléfono puede seguir escuchando su micrófono interno aunque tengas cable enchufado. Hay que aislarlo antes de medir la consola.',
    prepMuteSteps:
      '· No quites el permiso de micrófono a Soundcheck Pocket (la app deja de medir).\n· En MIUI/HyperOS: Privacidad → Micrófono → bloquea otras apps si quieres; esta app debe poder grabar.\n· Opcional: tapa los agujeros del mic del móvil con cinta mientras calibras.\n· Jack: cable TRS (2 anillos) no basta — adaptador línea→mic TRRS (3 anillos en el móvil) o interfaz de audio USB-C.',
    prepUsbNote:
      'USB PC↔móvil (carga/datos) no envía el audio del ordenador a la app. Sirve un dongle o interfaz USB de audio enchufado al Redmi, con la señal de la mesa en su entrada (jack o línea).',
    prepTapTest:
      'Pulsa «Escuchar señal» abajo. Con la consola en silencio, da golpecitos suaves junto al mic del Redmi: si las barras bailan al ritmo, aún entra el mic interno — revisa cable/adaptador antes del paso 1.',
    prepConfirm:
      'Confirmo: con la consola en silencio el medidor no reacciona a golpes en el teléfono (solo a la mesa cuando toque audio).',
    prepRequired: 'Marca la casilla de arriba para habilitar la verificación.',
    androidVerifyIntro:
      'Paso 1: laptop/consola en silencio. Paso 2: reproduce ruido rosa. Si el medidor se mueve en silencio, suele ser el micrófono del teléfono, no el jack.',
    verifySilence: '1. Verificar silencio (sin audio)',
    verifySignal: '2. Verificar señal (con ruido rosa)',
    silenceOk:
      'Silencio correcto. Reproduce ruido rosa en la laptop/consola y pulsa el paso 2.',
    silenceNoMetering:
      'No hubo lecturas de nivel durante la prueba. Comprueba el dongle USB-C, el cable y que la app tenga permiso de micrófono. Vuelve a pulsar el paso 1.',
    silenceFailed:
      'Paso 1 no pasó: con la laptop en silencio hay demasiado nivel o variación. No es una línea quieta por el jack: suele ser el micrófono del teléfono, cable TRRS sin señal en el pin de mic, falta de adaptador línea→mic, o el sistema (MIUI) que no enruta al conector.',
    silenceFailedMetrics:
      'Medido: pico {{peak}} dB, variación {{stdDev}} dB. En silencio debería estar bajo {{maxPeak}} dB y variar menos de {{maxStdDev}} dB.',
    signalFailed:
      'No subió lo suficiente al reproducir ruido rosa. Sube el volumen de la laptop/consola y vuelve a intentar el paso 2.',
    meterWithoutSourceHint:
      'Si el medidor se mueve sin audio en la consola, no calibres: es micrófono o ruido, no señal de línea.',
    devicesSeen: 'Entradas que ve el teléfono: {{list}}',
    requestingPermission: 'Solicitando acceso al audio…',
    permissionDenied:
      'Sin permiso de audio no podemos medir la señal. Actívalo en ajustes del teléfono.',
    inputActive: 'Entrada de consola: {{name}}',
    openSettings: 'Abrir ajustes',
    holdGood: 'Mantén este nivel ~{{seconds}} s más…',
    readyToContinue: 'Señal estable. Puedes continuar.',
    alreadyCompleted:
      'Ya calibraste en esta sesión. Puedes repetir la escucha o continuar cuando el nivel sea estable.',
    signal: {
      idle: 'Conecta jack o USB y pulsa «Verificar conexión» si hace falta. Luego «Escuchar señal».',
      tooLow:
        'Señal muy baja. Sube un poco la salida de la consola o acerca la conexión.',
      good: 'Nivel adecuado. Mantén este volumen unos segundos.',
      high: 'Señal alta. Baja un poco la salida de la consola.',
      clipping:
        'Casi saturando la entrada. Baja la consola antes de seguir.',
      noisy:
        'Mucho ruido o variación. Revisa cables, tierra y fuentes de interferencia.',
    },
  },
  placeholders: {
    individual: {
      title: 'Prueba por instrumento',
      body: 'Cada fuente sonará sola mientras medimos nivel, picos y graves. Las referencias alimentan el resto del soundcheck.',
    },
    comparison: {
      title: 'Comparación entre instrumentos',
      body: 'Contrastaremos niveles y rangos entre las referencias capturadas.',
    },
    fullBand: {
      title: 'Banda completa',
      body: 'Tocarán una sección intensa del show para comparar la mezcla con las referencias individuales.',
    },
    checklist: {
      title: 'Checklist final',
      body: 'Resumen del soundcheck con recomendaciones claras para la consola.',
    },
  },
} as const;

export default es;
