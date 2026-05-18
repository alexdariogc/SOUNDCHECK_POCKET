/** expo-audio metering is reported in dB, roughly -160 (silence) to 0 (hot). */
export const METER_DISPLAY_MIN_DB = -60;
export const METER_DISPLAY_MAX_DB = 0;

export type SignalQuality =
  | 'idle'
  | 'tooLow'
  | 'good'
  | 'high'
  | 'clipping'
  | 'noisy';

const DB_TOO_LOW = -48;
const DB_GOOD_MIN = -42;
const DB_GOOD_MAX = -14;
const DB_HIGH = -10;
const DB_CLIP = -4;

const NOISE_STD_DEV_THRESHOLD = 9;
const NOISE_SAMPLE_WINDOW = 24;

export function dbToMeterFraction(db: number | undefined): number {
  if (db == null || !Number.isFinite(db) || db <= -160) return 0;
  const clamped = Math.max(METER_DISPLAY_MIN_DB, Math.min(METER_DISPLAY_MAX_DB, db));
  return (clamped - METER_DISPLAY_MIN_DB) / (METER_DISPLAY_MAX_DB - METER_DISPLAY_MIN_DB);
}

export function classifyInstantDb(db: number): SignalQuality {
  if (db > DB_CLIP) return 'clipping';
  if (db > DB_HIGH) return 'high';
  if (db >= DB_GOOD_MIN && db <= DB_GOOD_MAX) return 'good';
  if (db < DB_TOO_LOW) return 'tooLow';
  return 'tooLow';
}

export function pushMeterSample(samples: number[], db: number, maxLength = NOISE_SAMPLE_WINDOW): number[] {
  const next = [...samples, db];
  if (next.length > maxLength) next.shift();
  return next;
}

export function detectNoisyFloor(samples: number[]): boolean {
  if (samples.length < 12) return false;
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  if (mean < -55 || mean > -12) return false;
  const variance =
    samples.reduce((acc, v) => acc + (v - mean) ** 2, 0) / samples.length;
  return Math.sqrt(variance) >= NOISE_STD_DEV_THRESHOLD;
}

export function resolveSignalQuality(
  listening: boolean,
  db: number | undefined,
  recentSamples: number[],
): SignalQuality {
  if (!listening || db == null || !Number.isFinite(db)) return 'idle';
  if (detectNoisyFloor(recentSamples)) return 'noisy';
  return classifyInstantDb(db);
}

/** Milliseconds of stable "good" level required before advancing. */
export const GOOD_SIGNAL_HOLD_MS = 2000;
