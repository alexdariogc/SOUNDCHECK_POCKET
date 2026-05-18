const en = {
  common: {
    continue: 'Continue',
    back: 'Back',
    comingSoon: 'Coming soon in this version.',
  },
  steps: {
    instruments: 'Instruments',
    calibration: 'Calibration',
    individual: 'Individual test',
    comparison: 'Comparison',
    fullBand: 'Full band',
    checklist: 'Final checklist',
    badge: 'Step {{current}} of {{total}} · {{name}}',
  },
  instruments: {
    selectTitle: 'Which instruments will you use?',
    selectSubtitle:
      'Pick everything that will play in the show. Order defines how we guide each individual test.',
    catalogSection: 'Catalog',
    orderSection: 'Test order',
    orderHint: 'We will test one at a time in this order. Use the arrows to adjust.',
    continue_zero: 'Select at least one instrument',
    continue_one: 'Continue with {{count}} instrument',
    continue_other: 'Continue with {{count}} instruments',
    moveUpA11y: 'Move {{name}} up',
    moveDownA11y: 'Move {{name}} down',
    items: {
      voice: 'Lead vocals',
      backing_vocals: 'Backing vocals',
      bass: 'Bass',
      guitar: 'Guitar',
      keys: 'Keys / synth',
      acoustic_drums: 'Acoustic drums',
      electronic_drums: 'Electronic drums',
      tracks: 'Tracks / sequences',
      percussion: 'Percussion',
      winds: 'Horns / winds',
    },
    hints: {
      voice: 'Sing the loudest part of the show',
    },
  },
  calibration: {
    title: 'Input calibration',
    subtitle:
      'Connect a mixer output to the phone. We will check level, clipping, and noise before tests.',
    connectionTitle: 'Recommended connection',
    connectionBody:
      'Use a cable or interface that will not clip the phone input. Start with low mixer level and raise slowly.',
    sources: {
      recOut: 'REC OUT / record bus',
      auxOut: 'AUX OUT (controlled level)',
      monitorOut: 'MONITOR OUT',
      mainOut: 'MAIN OUT (careful — often very hot)',
    },
    meterTitle: 'Input level',
    startListening: 'Listen to signal',
    stopListening: 'Stop',
    startHint: 'Send audio from the mixer (pink noise, soft playback, or one instrument) while we listen.',
    requestingPermission: 'Requesting microphone access…',
    permissionDenied: 'Microphone access is required to measure the signal. Enable it in system settings.',
    openSettings: 'Open settings',
    holdGood: 'Hold this level for ~{{seconds}} more seconds…',
    readyToContinue: 'Signal is stable. You can continue.',
    signal: {
      idle: 'Tap “Listen to signal” with the mixer connected.',
      tooLow: 'Signal is very low. Raise the mixer output a little.',
      good: 'Level looks good. Hold it steady for a few seconds.',
      high: 'Signal is hot. Lower the mixer output a bit.',
      clipping: 'Input is nearly clipping. Lower the mixer before continuing.',
      noisy: 'Lots of noise or level jumping. Check cables, grounding, and interference.',
    },
  },
  placeholders: {
    individual: {
      title: 'Per-instrument test',
      body: 'Each source plays alone while we measure level, peaks, and low end. References feed the rest of the soundcheck.',
    },
    comparison: {
      title: 'Compare instruments',
      body: 'We will contrast levels and ranges across captured references.',
    },
    fullBand: {
      title: 'Full band',
      body: 'Play an intense section of the show to compare the mix against individual references.',
    },
    checklist: {
      title: 'Final checklist',
      body: 'Soundcheck summary with clear recommendations for the mixer.',
    },
  },
} as const;

export default en;
