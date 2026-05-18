import { describe, expect, it } from 'vitest';

import {
  analyzeSignalProbe,
  analyzeSilenceProbe,
  SILENCE_MAX_PEAK_DB,
  SIGNAL_MIN_DELTA_DB,
} from './androidLineSignalProbe';

describe('analyzeSilenceProbe', () => {
  it('passes when line is quiet and stable', () => {
    const samples = Array.from({ length: 20 }, () => -58);
    expect(analyzeSilenceProbe(samples).pass).toBe(true);
  });

  it('fails when level moves without source audio (mic / cable noise)', () => {
    const samples = [-35, -42, -30, -38, -33, -40];
    expect(analyzeSilenceProbe(samples).pass).toBe(false);
  });

  it('ignores a few startup spikes when the steady tail is quiet', () => {
    const steady = Array.from({ length: 18 }, () => -58);
    const withSpikes = [0, -5, ...steady];
    expect(analyzeSilenceProbe(withSpikes).pass).toBe(true);
  });

  it('passes when metering reports digital silence (-160 dB)', () => {
    const samples = Array.from({ length: 20 }, () => -160);
    const result = analyzeSilenceProbe(samples);
    expect(result.pass).toBe(true);
    expect(result.peak).toBe(-160);
    expect(result.stdDev).toBe(0);
  });

  it('fails when too few metering samples', () => {
    expect(analyzeSilenceProbe([-50, -55]).failure).toBe('no_metering');
  });

  it('fails when peak is too hot for silence', () => {
    const samples = Array.from({ length: 12 }, () => SILENCE_MAX_PEAK_DB + 2);
    expect(analyzeSilenceProbe(samples).pass).toBe(false);
  });
});

describe('analyzeSignalProbe', () => {
  it('passes when pink noise clearly rises above silence', () => {
    const baseline = -58;
    const samples = Array.from({ length: 15 }, () => -32);
    const result = analyzeSignalProbe(samples, baseline);
    expect(result.pass).toBe(true);
    expect(result.delta).toBeGreaterThanOrEqual(SIGNAL_MIN_DELTA_DB);
  });

  it('fails when level does not rise after silence', () => {
    const baseline = -55;
    const samples = Array.from({ length: 15 }, () => -54);
    expect(analyzeSignalProbe(samples, baseline).pass).toBe(false);
  });
});
