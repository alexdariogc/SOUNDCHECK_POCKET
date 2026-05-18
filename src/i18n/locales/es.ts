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
      'Conecta una salida de la consola al teléfono. Mediremos nivel, clipping y ruido antes de las pruebas.',
    connectionTitle: 'Conexión recomendada',
    connectionBody:
      'Usa un cable o interfaz que no sature la entrada del teléfono. Empieza con el volumen de consola bajo y sube poco a poco.',
    sources: {
      recOut: 'REC OUT / grabación',
      auxOut: 'AUX OUT (nivel controlado)',
      monitorOut: 'MONITOR OUT',
      mainOut: 'MAIN OUT (con cuidado — suele ir muy fuerte)',
    },
    meterTitle: 'Nivel de entrada',
    startListening: 'Escuchar señal',
    stopListening: 'Detener',
    startHint: 'Haz sonar la consola (ruido rosa, música suave o un instrumento) mientras escuchamos.',
    requestingPermission: 'Solicitando acceso al micrófono…',
    permissionDenied:
      'Sin micrófono no podemos medir la señal. Actívalo en ajustes del teléfono.',
    openSettings: 'Abrir ajustes',
    holdGood: 'Mantén este nivel ~{{seconds}} s más…',
    readyToContinue: 'Señal estable. Puedes continuar.',
    signal: {
      idle: 'Pulsa «Escuchar señal» con la consola conectada.',
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
