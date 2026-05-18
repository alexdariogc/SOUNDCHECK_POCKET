import { RecordingPresets, type RecordingOptions } from 'expo-audio';

/** Live metering only — low quality preset keeps CPU/battery reasonable. */
export const calibrationRecordingOptions: RecordingOptions = {
  ...RecordingPresets.LOW_QUALITY,
  isMeteringEnabled: true,
};
