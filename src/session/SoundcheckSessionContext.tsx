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
  type SoundcheckSessionState,
  type SoundcheckStep,
} from '../domain/types';

type Action =
  | { type: 'TOGGLE_INSTRUMENT'; id: InstrumentId }
  | { type: 'MOVE_INSTRUMENT'; id: InstrumentId; direction: 'up' | 'down' }
  | { type: 'SET_STEP'; step: SoundcheckStep }
  | { type: 'RESET_SESSION' };

function reducer(state: SoundcheckSessionState, action: Action): SoundcheckSessionState {
  switch (action.type) {
    case 'TOGGLE_INSTRUMENT': {
      const exists = state.instrumentOrder.includes(action.id);
      return {
        ...state,
        instrumentOrder: exists
          ? state.instrumentOrder.filter((id) => id !== action.id)
          : [...state.instrumentOrder, action.id],
      };
    }
    case 'MOVE_INSTRUMENT': {
      const index = state.instrumentOrder.indexOf(action.id);
      if (index === -1) return state;
      const target = action.direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= state.instrumentOrder.length) return state;
      const next = [...state.instrumentOrder];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...state, instrumentOrder: next };
    }
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'RESET_SESSION':
      return initialSessionState;
    default:
      return state;
  }
}

type SoundcheckSessionContextValue = {
  state: SoundcheckSessionState;
  toggleInstrument: (id: InstrumentId) => void;
  moveInstrument: (id: InstrumentId, direction: 'up' | 'down') => void;
  goToStep: (step: SoundcheckStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetSession: () => void;
  isInstrumentSelected: (id: InstrumentId) => boolean;
  canAdvanceFromInstruments: boolean;
};

const SoundcheckSessionContext = createContext<SoundcheckSessionContextValue | null>(null);

export function SoundcheckSessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialSessionState);

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
