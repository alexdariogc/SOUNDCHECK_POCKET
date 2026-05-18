import { RecordingPresets, type RecordingOptions } from 'expo-audio';

import { CALIBRATION_METERING_ENABLED } from './calibrationConfig';

/**
 * Console line-in (jack / USB interface), not voice-call capture.
 * LOW_QUALITY uses AMR-NB on Android, which targets the phone microphone.
 */
export const calibrationRecordingOptions: RecordingOptions = {
  ...RecordingPresets.HIGH_QUALITY,
  isMeteringEnabled: CALIBRATION_METERING_ENABLED,
  android: {
    ...RecordingPresets.HIGH_QUALITY.android,
    /** Routes to wired headset jack when TRRS/USB audio is connected. */
    audioSource: 'default',
  },
};
