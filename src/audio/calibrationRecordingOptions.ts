import { RecordingPresets, type RecordingOptions } from 'expo-audio';

import { CALIBRATION_METERING_ENABLED } from './calibrationConfig';

/** Live metering only — low quality preset keeps CPU/battery reasonable. */
export const calibrationRecordingOptions: RecordingOptions = {
  ...RecordingPresets.LOW_QUALITY,
  isMeteringEnabled: CALIBRATION_METERING_ENABLED,
};
