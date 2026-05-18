import { describe, expect, it } from 'vitest';

import { CALIBRATION_METERING_ENABLED } from './calibrationConfig';

describe('calibration config', () => {
  it('requires metering for live level monitoring', () => {
    expect(CALIBRATION_METERING_ENABLED).toBe(true);
  });
});
