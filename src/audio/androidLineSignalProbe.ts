import type { AudioRecorder, RecordingInput } from 'expo-audio';

/** Steady-state sampling after recorder warm-up (MIUI often spikes on record()). */
export const PROBE_WARMUP_MS = 700;

export const ANDROID_SIGNAL_PROBE_MS = 2800;

/** With no source audio, line should sit below this (mic/room noise fails). */
export const SILENCE_MAX_PEAK_DB = -50;

export const SILENCE_MAX_STD_DEV_DB = 8;

/** Minimum rise when pink noise starts (dB above silence probe). */
export const SIGNAL_MIN_DELTA_DB = 12;

export const SIGNAL_MIN_PEAK_DB = -45;

export const ANDROID_SIGNAL_DETECTED_INPUT: RecordingInput = {
  name: 'Jack 3.5 mm (señal verificada)',
  type: 'android_line_signal',
  uid: 'android-line-signal',
};

export type LineProbeSamples = {
  peak: number;
  samples: number[];
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function stdDevDb(samples: number[]): number {
  if (samples.length < 2) return 0;
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const variance =
    samples.reduce((acc, v) => acc + (v - mean) ** 2, 0) / samples.length;
  return Math.sqrt(variance);
}

function trimProbeCore(samples: number[], trimFraction = 0.15): number[] {
  if (samples.length < 5) return samples;
  const sorted = [...samples].sort((a, b) => a - b);
  const trim = Math.max(1, Math.floor(sorted.length * trimFraction));
  const core = sorted.slice(trim, sorted.length - trim);
  return core.length >= 2 ? core : samples;
}

/** Ignore startup spikes / AGC glitches when judging silence stability. */
export function trimmedStdDevDb(
  samples: number[],
  trimFraction = 0.15,
): number {
  const core = trimProbeCore(samples, trimFraction);
  return stdDevDb(core);
}

export function trimmedPeakDb(samples: number[], trimFraction = 0.15): number {
  const core = trimProbeCore(samples, trimFraction);
  return core.length > 0 ? Math.max(...core) : Math.max(...samples);
}

export function filterProbeMeterSamples(samples: number[]): number[] {
  return samples.filter((v) => Number.isFinite(v) && v >= -160 && v <= 0);
}

export type SilenceProbeFailure = 'no_metering' | 'too_loud' | 'unstable';

export function analyzeSilenceProbe(samples: number[]): {
  pass: boolean;
  peak: number;
  stdDev: number;
  failure?: SilenceProbeFailure;
} {
  const finite = samples.filter((v) => Number.isFinite(v));
  if (finite.length < 5) {
    return { pass: false, peak: -160, stdDev: 0, failure: 'no_metering' };
  }

  const filtered = filterProbeMeterSamples(finite);
  if (filtered.length < 5) {
    return { pass: false, peak: -160, stdDev: 0, failure: 'no_metering' };
  }

  const peak = trimmedPeakDb(filtered);
  const dev = trimmedStdDevDb(filtered);
  if (peak <= SILENCE_MAX_PEAK_DB && dev <= SILENCE_MAX_STD_DEV_DB) {
    return { pass: true, peak, stdDev: dev };
  }

  return {
    pass: false,
    peak,
    stdDev: dev,
    failure: peak > SILENCE_MAX_PEAK_DB ? 'too_loud' : 'unstable',
  };
}

export function analyzeSignalProbe(
  samples: number[],
  baselinePeakDb: number,
): { pass: boolean; peak: number; delta: number } {
  const filtered = filterProbeMeterSamples(samples);
  if (filtered.length < 5) {
    return { pass: false, peak: -160, delta: 0 };
  }
  const peak = Math.max(...filtered);
  const delta = peak - baselinePeakDb;
  const pass = peak >= SIGNAL_MIN_PEAK_DB && delta >= SIGNAL_MIN_DELTA_DB;
  return { pass, peak, delta };
}

/** @deprecated Use two-phase silence + signal verification instead. */
export function isStrongLineSignal(peakMeteringDb: number): boolean {
  return Number.isFinite(peakMeteringDb) && peakMeteringDb > SILENCE_MAX_PEAK_DB;
}

export async function probeLineSignalSamples(
  recorder: AudioRecorder,
  durationMs = ANDROID_SIGNAL_PROBE_MS,
): Promise<LineProbeSamples> {
  const samples: number[] = [];
  let startedHere = false;

  try {
    const status = recorder.getStatus();
    if (!status.isRecording) {
      recorder.record();
      startedHere = true;
      await delay(PROBE_WARMUP_MS);
    }

    const deadline = Date.now() + durationMs;
    while (Date.now() < deadline) {
      await delay(100);
      const { metering } = recorder.getStatus();
      if (metering != null && Number.isFinite(metering)) {
        samples.push(metering);
      }
    }
  } catch {
    return { peak: -160, samples };
  } finally {
    if (startedHere) {
      try {
        await recorder.stop();
      } catch {
        // ignore
      }
    }
  }

  const peak = samples.length > 0 ? Math.max(...samples) : -160;
  return { peak, samples };
}
