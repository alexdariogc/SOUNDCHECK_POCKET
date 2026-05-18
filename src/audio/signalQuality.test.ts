import { describe, expect, it } from 'vitest';

import {
  classifyInstantDb,
  dbToMeterFraction,
  detectNoisyFloor,
  isGoodSignal,
  pushMeterSample,
  resolveSignalQuality,
} from './signalQuality';

function repeatDb(value: number, count: number): number[] {
  return Array.from({ length: count }, () => value);
}

function alternatingNoisySamples(count = 16): number[] {
  return Array.from({ length: count }, (_, i) => (i % 2 === 0 ? -40 : -15));
}

describe('dbToMeterFraction', () => {
  it('returns 0 for missing or silent input', () => {
    expect(dbToMeterFraction(undefined)).toBe(0);
    expect(dbToMeterFraction(-160)).toBe(0);
  });

  it('maps display range endpoints', () => {
    expect(dbToMeterFraction(-60)).toBe(0);
    expect(dbToMeterFraction(0)).toBe(1);
  });

  it('clamps hot values to 1', () => {
    expect(dbToMeterFraction(6)).toBe(1);
  });
});

describe('classifyInstantDb', () => {
  it('detects clipping, high, good, and low levels', () => {
    expect(classifyInstantDb(-2)).toBe('clipping');
    expect(classifyInstantDb(-8)).toBe('high');
    expect(classifyInstantDb(-30)).toBe('good');
    expect(classifyInstantDb(-55)).toBe('tooLow');
  });

  it('treats borderline weak level as too low', () => {
    expect(classifyInstantDb(-45)).toBe('tooLow');
    expect(classifyInstantDb(-42)).toBe('good');
  });
});

describe('detectNoisyFloor', () => {
  it('ignores short histories', () => {
    expect(detectNoisyFloor([-30, -28])).toBe(false);
  });

  it('flags unstable mid-level input', () => {
    expect(detectNoisyFloor(alternatingNoisySamples())).toBe(true);
  });

  it('ignores stable good-level input', () => {
    expect(detectNoisyFloor(repeatDb(-30, 16))).toBe(false);
  });
});

describe('resolveSignalQuality', () => {
  it('is idle when not listening', () => {
    expect(resolveSignalQuality(false, -30, [])).toBe('idle');
  });

  it('prioritizes noise over instant classification', () => {
    expect(resolveSignalQuality(true, -30, alternatingNoisySamples())).toBe('noisy');
  });

  it('classifies instant level while listening', () => {
    expect(resolveSignalQuality(true, -30, repeatDb(-30, 16))).toBe('good');
    expect(resolveSignalQuality(true, -55, repeatDb(-55, 16))).toBe('tooLow');
  });
});

describe('pushMeterSample', () => {
  it('caps history length', () => {
    let samples: number[] = [];
    for (let i = 0; i < 30; i++) samples = pushMeterSample(samples, -20, 5);
    expect(samples).toHaveLength(5);
    expect(samples[0]).toBe(-20);
  });
});

describe('isGoodSignal', () => {
  it('matches good quality only', () => {
    expect(isGoodSignal('good')).toBe(true);
    expect(isGoodSignal('high')).toBe(false);
  });
});
