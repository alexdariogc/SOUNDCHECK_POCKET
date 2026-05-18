import { describe, expect, it } from 'vitest';

import { shouldPrepareRecorder } from './calibrationRecorderSession';

describe('shouldPrepareRecorder', () => {
  it('skips prepare when session is already ready', () => {
    expect(
      shouldPrepareRecorder({ canRecord: true, mediaServicesDidReset: false }),
    ).toBe(false);
  });

  it('prepares when not ready or after media reset', () => {
    expect(
      shouldPrepareRecorder({ canRecord: false, mediaServicesDidReset: false }),
    ).toBe(true);
    expect(
      shouldPrepareRecorder({ canRecord: true, mediaServicesDidReset: true }),
    ).toBe(true);
  });
});
