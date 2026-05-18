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
      'Connect the mixer only via 3.5 mm TRRS jack or USB-C interface. We do not use the phone microphone.',
    connectionTitle: 'Recommended connection',
    connectionBody:
      'Connect the mixer output to the TRRS jack (3.5 mm) or a USB-C interface. Use a cable that will not clip the input. Start with low mixer level and raise slowly.',
    sources: {
      recOut: 'REC OUT / record bus',
      auxOut: 'AUX OUT (controlled level)',
      monitorOut: 'MONITOR OUT',
      mainOut: 'MAIN OUT (careful — often very hot)',
    },
    meterTitle: 'Input level',
    listening: 'Listening… Send audio from the mixer.',
    startListening: 'Listen to signal',
    stopListening: 'Stop',
    startHint:
      'With the cable or interface connected, send audio from the mixer (pink noise, soft playback, or one instrument).',
    checkConnection: 'Check connection',
    checkingConnection: 'Checking inputs reported by the phone…',
    verifyingSilence: 'Step 1: measuring ~3 s. Laptop silent — no music or pink noise.',
    verifyingSignal: 'Step 2: measuring ~3 s. Play pink noise from the laptop.',
    externalInputRequired:
      'Connect the mixer to the 3.5 mm TRRS jack or a USB-C audio interface. This app does not use the phone microphone.',
    prepTitle: 'Before calibrating (important on Android)',
    prepBody:
      'The phone may still listen through its built-in mic even with a cable plugged in. Isolate it before measuring the mixer.',
    prepMuteSteps:
      '· Do not revoke microphone permission for Soundcheck Pocket (the app stops measuring).\n· On MIUI/HyperOS: Privacy → Microphone — restrict other apps if you want; this app must keep access.\n· Optional: cover the phone mic holes with tape while calibrating.\n· Jack: a TRS cable (2 rings) is not enough — line→mic TRRS adapter (3 rings on the phone) or a USB-C audio interface.',
    prepUsbNote:
      'A PC↔phone USB data/charge cable does not feed the computer’s audio into the app. Use a USB audio dongle or interface plugged into the phone, with the mixer fed into its input (jack or line).',
    prepTapTest:
      'Tap “Listen to signal” below. With the mixer silent, tap lightly near the phone mic: if the bars bounce in sync, the internal mic is still in the path — fix cable/adapter before step 1.',
    prepConfirm:
      'I confirm: with the mixer silent the meter does not react to taps on the phone (only to the mixer when I send audio).',
    prepRequired: 'Check the box above to enable verification.',
    androidVerifyIntro:
      'Step 1: mixer/laptop silent. Step 2: play pink noise. If the meter moves during silence, it is usually the phone mic, not the jack.',
    verifySilence: '1. Verify silence (no audio)',
    verifySignal: '2. Verify signal (pink noise on)',
    silenceOk: 'Silence OK. Play pink noise from the mixer/laptop, then tap step 2.',
    silenceNoMetering:
      'No level readings during the test. Check the USB-C dongle, cabling, and microphone permission, then retry step 1.',
    silenceFailed:
      'Step 1 failed: too much level or variation with the laptop silent. Not a quiet line on the jack — usually the phone mic, TRRS wiring without signal on the mic pin, missing line→mic adapter, or the OS (MIUI) not routing to the connector.',
    silenceFailedMetrics:
      'Measured: peak {{peak}} dB, variation {{stdDev}} dB. Silence should stay below {{maxPeak}} dB and vary less than {{maxStdDev}} dB.',
    signalFailed:
      'Level did not rise enough when playing pink noise. Raise mixer/laptop volume and retry step 2.',
    meterWithoutSourceHint:
      'If the meter moves with no mixer audio, do not calibrate — that is mic or noise, not line signal.',
    devicesSeen: 'Inputs reported by the phone: {{list}}',
    requestingPermission: 'Requesting audio access…',
    permissionDenied:
      'Audio access is required to measure the signal. Enable it in system settings.',
    inputActive: 'Console input: {{name}}',
    openSettings: 'Open settings',
    holdGood: 'Hold this level for ~{{seconds}} more seconds…',
    readyToContinue: 'Signal is stable. You can continue.',
    alreadyCompleted:
      'Calibration was saved for this session. You can listen again or continue once the level is stable.',
    signal: {
      idle: 'Connect jack or USB and tap “Check connection” if needed. Then “Listen to signal”.',
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
