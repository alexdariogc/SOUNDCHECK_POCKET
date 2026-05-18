import { describe, expect, it } from 'vitest';

import { initialSessionState } from '../domain/types';
import { soundcheckSessionReducer } from './soundcheckSessionReducer';

describe('soundcheckSessionReducer', () => {
  it('stores calibration result', () => {
    const result = { completedAt: 1_700_000_000_000, peakMeteringDb: -18 };
    const next = soundcheckSessionReducer(
      { ...initialSessionState, currentStep: 'calibration' },
      { type: 'SET_CALIBRATION', result },
    );

    expect(next.calibration).toEqual(result);
    expect(next.currentStep).toBe('calibration');
  });

  it('clears calibration on session reset', () => {
    const withCalibration = soundcheckSessionReducer(initialSessionState, {
      type: 'SET_CALIBRATION',
      result: { completedAt: 1, peakMeteringDb: -20 },
    });

    expect(soundcheckSessionReducer(withCalibration, { type: 'RESET_SESSION' })).toEqual(
      initialSessionState,
    );
  });
});
