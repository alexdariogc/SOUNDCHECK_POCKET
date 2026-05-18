import { describe, expect, it } from 'vitest';

import {
  canAdvanceCalibration,
  computeGoodHeldMs,
  computeHoldProgress,
  nextPeakMeteringDb,
  secondsUntilAdvance,
} from './calibrationAdvance';
import { GOOD_SIGNAL_HOLD_MS } from './signalQuality';

describe('computeGoodHeldMs', () => {
  it('returns 0 when not in good state', () => {
    expect(computeGoodHeldMs(Date.now() - 500, 'high', 1_000)).toBe(0);
  });

  it('measures elapsed time in good state', () => {
    expect(computeGoodHeldMs(800, 'good', 1_500)).toBe(700);
  });
});

describe('canAdvanceCalibration', () => {
  it('requires listening, good signal, and hold duration', () => {
    expect(
      canAdvanceCalibration({
        listening: false,
        signal: 'good',
        goodHeldMs: GOOD_SIGNAL_HOLD_MS,
      }),
    ).toBe(false);

    expect(
      canAdvanceCalibration({
        listening: true,
        signal: 'high',
        goodHeldMs: GOOD_SIGNAL_HOLD_MS,
      }),
    ).toBe(false);

    expect(
      canAdvanceCalibration({
        listening: true,
        signal: 'good',
        goodHeldMs: GOOD_SIGNAL_HOLD_MS - 1,
      }),
    ).toBe(false);

    expect(
      canAdvanceCalibration({
        listening: true,
        signal: 'good',
        goodHeldMs: GOOD_SIGNAL_HOLD_MS,
      }),
    ).toBe(true);
  });
});

describe('computeHoldProgress', () => {
  it('ramps from 0 to 1 during good hold', () => {
    expect(computeHoldProgress(0, 'good')).toBe(0);
    expect(computeHoldProgress(GOOD_SIGNAL_HOLD_MS / 2, 'good')).toBe(0.5);
    expect(computeHoldProgress(GOOD_SIGNAL_HOLD_MS, 'good')).toBe(1);
    expect(computeHoldProgress(5_000, 'good')).toBe(1);
  });

  it('resets when signal is not good', () => {
    expect(computeHoldProgress(1_000, 'high')).toBe(0);
  });
});

describe('secondsUntilAdvance', () => {
  it('counts up remaining whole seconds', () => {
    expect(secondsUntilAdvance(0, 'good')).toBe(Math.ceil(GOOD_SIGNAL_HOLD_MS / 1000));
    expect(secondsUntilAdvance(GOOD_SIGNAL_HOLD_MS - 500, 'good')).toBe(1);
    expect(secondsUntilAdvance(GOOD_SIGNAL_HOLD_MS, 'good')).toBe(0);
  });
});

describe('nextPeakMeteringDb', () => {
  it('tracks the loudest sample', () => {
    expect(nextPeakMeteringDb(-40, -30)).toBe(-30);
    expect(nextPeakMeteringDb(-20, -35)).toBe(-20);
    expect(nextPeakMeteringDb(-20, undefined)).toBe(-20);
  });
});
