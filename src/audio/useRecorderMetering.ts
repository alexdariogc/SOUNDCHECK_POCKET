import type { AudioRecorder } from 'expo-audio';
import { useEffect, useState } from 'react';

/** Polls recorder metering only while listening; avoids getStatus on a released object. */
export function useRecorderMetering(
  recorder: AudioRecorder,
  listening: boolean,
  intervalMs = 100,
): number | undefined {
  const [meteringDb, setMeteringDb] = useState<number | undefined>();

  useEffect(() => {
    if (!listening) {
      setMeteringDb(undefined);
      return;
    }

    const tick = () => {
      try {
        const { metering } = recorder.getStatus();
        setMeteringDb(metering);
      } catch {
        // Recorder was released during unmount.
      }
    };

    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [recorder, listening, intervalMs]);

  return meteringDb;
}
