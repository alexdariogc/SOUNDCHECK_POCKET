/** Recorder status fields used to decide if prepareToRecordAsync is needed. */
export type RecorderPrepareStatus = {
  canRecord: boolean;
  mediaServicesDidReset: boolean;
};

/**
 * expo-audio leaves the recorder prepared after stop(); calling prepare again throws.
 */
export function shouldPrepareRecorder(status: RecorderPrepareStatus): boolean {
  return status.mediaServicesDidReset || !status.canRecord;
}
