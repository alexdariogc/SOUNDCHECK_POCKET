import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import type { InstrumentId } from '../domain/instruments';
import {
  initialSessionState,
  SOUNDCHECK_STEPS,
  type CalibrationResult,
  type SoundcheckSessionState,
  type SoundcheckStep,
} from '../domain/types';
import { soundcheckSessionReducer } from './soundcheckSessionReducer';

type SoundcheckSessionContextValue = {
  state: SoundcheckSessionState;
  toggleInstrument: (id: InstrumentId) => void;
  moveInstrument: (id: InstrumentId, direction: 'up' | 'down') => void;
  goToStep: (step: SoundcheckStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetSession: () => void;
  completeCalibration: (result: CalibrationResult) => void;
  isInstrumentSelected: (id: InstrumentId) => boolean;
  canAdvanceFromInstruments: boolean;
};

const SoundcheckSessionContext = createContext<SoundcheckSessionContextValue | null>(null);

export function SoundcheckSessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(soundcheckSessionReducer, initialSessionState);

  const toggleInstrument = useCallback((id: InstrumentId) => {
    dispatch({ type: 'TOGGLE_INSTRUMENT', id });
  }, []);

  const moveInstrument = useCallback((id: InstrumentId, direction: 'up' | 'down') => {
    dispatch({ type: 'MOVE_INSTRUMENT', id, direction });
  }, []);

  const goToStep = useCallback((step: SoundcheckStep) => {
    dispatch({ type: 'SET_STEP', step });
  }, []);

  const goToNextStep = useCallback(() => {
    const index = SOUNDCHECK_STEPS.indexOf(state.currentStep);
    const next = SOUNDCHECK_STEPS[index + 1];
    if (next) dispatch({ type: 'SET_STEP', step: next });
  }, [state.currentStep]);

  const goToPreviousStep = useCallback(() => {
    const index = SOUNDCHECK_STEPS.indexOf(state.currentStep);
    const prev = SOUNDCHECK_STEPS[index - 1];
    if (prev) dispatch({ type: 'SET_STEP', step: prev });
  }, [state.currentStep]);

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' });
  }, []);

  const completeCalibration = useCallback((result: CalibrationResult) => {
    dispatch({ type: 'SET_CALIBRATION', result });
  }, []);

  const isInstrumentSelected = useCallback(
    (id: InstrumentId) => state.instrumentOrder.includes(id),
    [state.instrumentOrder],
  );

  const value = useMemo<SoundcheckSessionContextValue>(
    () => ({
      state,
      toggleInstrument,
      moveInstrument,
      goToStep,
      goToNextStep,
      goToPreviousStep,
      resetSession,
      completeCalibration,
      isInstrumentSelected,
      canAdvanceFromInstruments: state.instrumentOrder.length > 0,
    }),
    [
      state,
      toggleInstrument,
      moveInstrument,
      goToStep,
      goToNextStep,
      goToPreviousStep,
      resetSession,
      completeCalibration,
      isInstrumentSelected,
    ],
  );

  return (
    <SoundcheckSessionContext.Provider value={value}>{children}</SoundcheckSessionContext.Provider>
  );
}

export function useSoundcheckSession(): SoundcheckSessionContextValue {
  const ctx = useContext(SoundcheckSessionContext);
  if (!ctx) {
    throw new Error('useSoundcheckSession must be used within SoundcheckSessionProvider');
  }
  return ctx;
}
