import { describe, expect, it } from 'vitest';

import {
  canUseConsoleCapture,
  isBuiltInRecordingInput,
  isConsoleRecordingInput,
  pickConsoleRecordingInput,
} from './consoleRecordingInput';

describe('pickConsoleRecordingInput', () => {
  it('prefers wired / USB over built-in mic', () => {
    const inputs = [
      { name: 'Built-in Microphone', type: 'builtin', uid: 'builtin' },
      { name: 'Wired headset', type: 'headset', uid: 'wired' },
    ];
    expect(pickConsoleRecordingInput(inputs)?.uid).toBe('wired');
  });

  it('returns null when only built-in is available', () => {
    const inputs = [{ name: 'Built-in Microphone', type: 'builtin', uid: 'builtin' }];
    expect(pickConsoleRecordingInput(inputs)).toBeNull();
  });

  it('ignores Android device model ids masquerading as inputs', () => {
    const inputs = [
      { name: '2201117TG', type: '2201117TG', uid: '2201117TG' },
    ];
    expect(pickConsoleRecordingInput(inputs)).toBeNull();
  });

  it('accepts Xiaomi-style short wired labels (h2w)', () => {
    const inputs = [
      { name: 'Built-in Microphone', type: 'builtin', uid: 'builtin' },
      { name: 'h2w', type: 'h2w', uid: 'h2w' },
    ];
    expect(pickConsoleRecordingInput(inputs)?.name).toBe('h2w');
  });

  it('accepts USB audio interfaces', () => {
    const inputs = [
      { name: 'Built-in Microphone', type: 'builtin', uid: 'builtin' },
      { name: 'USB Audio Device', type: 'usb', uid: 'usb-1' },
    ];
    expect(pickConsoleRecordingInput(inputs)?.uid).toBe('usb-1');
  });
});

describe('isConsoleRecordingInput', () => {
  it('rejects built-in labels', () => {
    expect(
      isConsoleRecordingInput({
        name: 'Bottom Microphone',
        type: 'MicrophoneBuiltIn',
        uid: '1',
      }),
    ).toBe(false);
  });
});

describe('canUseConsoleCapture', () => {
  it('requires a selected console input', () => {
    expect(
      canUseConsoleCapture({
        selected: null,
        available: [],
        hasConsoleInput: false,
      }),
    ).toBe(false);
    expect(
      canUseConsoleCapture({
        selected: { name: 'Wired headset', type: 'headset', uid: 'w' },
        available: [],
        hasConsoleInput: true,
      }),
    ).toBe(true);
  });
});

describe('isBuiltInRecordingInput', () => {
  it('detects built-in labels', () => {
    expect(
      isBuiltInRecordingInput({
        name: 'Bottom Microphone',
        type: 'MicrophoneBuiltIn',
        uid: '1',
      }),
    ).toBe(true);
  });
});
