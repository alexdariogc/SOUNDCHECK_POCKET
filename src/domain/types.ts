import type { InstrumentId } from './instruments';

export type SoundcheckStep =
  | 'instruments'
  | 'calibration'
  | 'individual'
  | 'comparison'
  | 'fullBand'
  | 'checklist';

export const SOUNDCHECK_STEPS: readonly SoundcheckStep[] = [
  'instruments',
  'calibration',
  'individual',
  'comparison',
  'fullBand',
  'checklist',
] as const;

/** i18n keys under steps.* */
export const STEP_LABEL_KEYS: Record<SoundcheckStep, `steps.${SoundcheckStep}`> = {
  instruments: 'steps.instruments',
  calibration: 'steps.calibration',
  individual: 'steps.individual',
  comparison: 'steps.comparison',
  fullBand: 'steps.fullBand',
  checklist: 'steps.checklist',
};

export function stepNumber(step: SoundcheckStep): number {
  return SOUNDCHECK_STEPS.indexOf(step) + 1;
}

export type CalibrationResult = {
  completedAt: number;
  /** Loudest metering sample observed during calibration (dB). */
  peakMeteringDb: number;
};

export type SoundcheckSessionState = {
  currentStep: SoundcheckStep;
  /** Test order for step 3+ */
  instrumentOrder: InstrumentId[];
  calibration: CalibrationResult | null;
};

export const initialSessionState: SoundcheckSessionState = {
  currentStep: 'instruments',
  instrumentOrder: [],
  calibration: null,
};
