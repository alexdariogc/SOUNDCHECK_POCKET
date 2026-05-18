import { GOOD_SIGNAL_HOLD_MS, type SignalQuality } from './signalQuality';

export type CalibrationAdvanceInput = {
  listening: boolean;
  signal: SignalQuality;
  goodHeldMs: number;
};

export function computeGoodHeldMs(
  goodSince: number | null,
  signal: SignalQuality,
  now = Date.now(),
): number {
  if (goodSince == null || signal !== 'good') return 0;
  return Math.max(0, now - goodSince);
}

export function canAdvanceCalibration({
  listening,
  signal,
  goodHeldMs,
}: CalibrationAdvanceInput): boolean {
  return listening && signal === 'good' && goodHeldMs >= GOOD_SIGNAL_HOLD_MS;
}

/** Progress toward the required stable “good” window, from 0 to 1. */
export function computeHoldProgress(goodHeldMs: number, signal: SignalQuality): number {
  if (signal !== 'good' || goodHeldMs <= 0) return 0;
  return Math.min(1, goodHeldMs / GOOD_SIGNAL_HOLD_MS);
}

export function secondsUntilAdvance(goodHeldMs: number, signal: SignalQuality): number {
  if (signal !== 'good') return 0;
  return Math.max(0, Math.ceil((GOOD_SIGNAL_HOLD_MS - goodHeldMs) / 1000));
}

export function nextPeakMeteringDb(currentPeak: number, sample: number | undefined): number {
  if (sample == null || !Number.isFinite(sample)) return currentPeak;
  return Math.max(currentPeak, sample);
}
