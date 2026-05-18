import type { AudioRecorder, RecordingInput } from 'expo-audio';

const BUILTIN_INPUT = /built[- ]?in|internal|phone|bottom|default/i;
const CONSOLE_INPUT =
  /headset|headphone|wired|jack|line|aux|usb|external|hdmi|dock|trrs|otg|interface|type-?c|auricular|manos.?libres|alambric|alámbr|audio|micro|mic|\bh2w\b|\bhs?w\b/i;

/** Android/Expo sometimes returns the handset model id (e.g. 2201117TG) as a fake "input". */
const DEVICE_ID_LIKE = /^[0-9A-Za-z]{6,}$/;

export type ConsoleInputSelection = {
  selected: RecordingInput | null;
  available: RecordingInput[];
  hasConsoleInput: boolean;
};

function matchesPatterns(input: RecordingInput, patterns: RegExp): boolean {
  return [input.name, input.type, input.uid].some((value) => patterns.test(value));
}

export function isBuiltInRecordingInput(input: RecordingInput): boolean {
  return matchesPatterns(input, BUILTIN_INPUT);
}

export function isConsoleRecordingInput(input: RecordingInput): boolean {
  if (isBuiltInRecordingInput(input)) return false;
  return matchesPatterns(input, CONSOLE_INPUT);
}

export function isPlausibleRecordingInput(input: RecordingInput): boolean {
  const name = input.name.trim();
  if (name.length < 2) return false;

  if (DEVICE_ID_LIKE.test(name) && !isConsoleRecordingInput(input)) {
    return false;
  }

  return isConsoleRecordingInput(input) || isBuiltInRecordingInput(input);
}

export function filterPlausibleInputs(inputs: RecordingInput[]): RecordingInput[] {
  return inputs.filter(isPlausibleRecordingInput);
}

/** Jack 3.5 mm (TRRS) or USB — never handset model ids or built-in mic. */
export function pickConsoleRecordingInput(
  inputs: RecordingInput[],
): RecordingInput | null {
  const consoleInputs = filterPlausibleInputs(inputs).filter(isConsoleRecordingInput);
  return consoleInputs[0] ?? null;
}

export function canUseConsoleCapture(selection: ConsoleInputSelection): boolean {
  return selection.hasConsoleInput;
}

export function formatAvailableInputNames(inputs: RecordingInput[]): string {
  const plausible = filterPlausibleInputs(inputs);
  if (plausible.length === 0) return '';
  return plausible.map((input) => input.name).join(' · ');
}

/** Call after `prepareToRecordAsync` so `getAvailableInputs` is populated. */
export function applyConsoleRecordingInput(
  recorder: AudioRecorder,
): ConsoleInputSelection {
  let raw: RecordingInput[] = [];
  try {
    raw = recorder.getAvailableInputs();
  } catch {
    return { selected: null, available: [], hasConsoleInput: false };
  }

  const available = filterPlausibleInputs(raw);
  const selected = pickConsoleRecordingInput(raw);
  if (selected) {
    try {
      recorder.setInput(selected.uid);
    } catch {
      // Some Android builds expose inputs but reject setInput; keep OS routing.
    }
  }

  return {
    selected,
    available,
    hasConsoleInput: selected != null,
  };
}
