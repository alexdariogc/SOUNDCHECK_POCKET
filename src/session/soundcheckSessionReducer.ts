import type { InstrumentId } from '../domain/instruments';
import {
  initialSessionState,
  type CalibrationResult,
  type SoundcheckSessionState,
  type SoundcheckStep,
} from '../domain/types';

export type SoundcheckSessionAction =
  | { type: 'TOGGLE_INSTRUMENT'; id: InstrumentId }
  | { type: 'MOVE_INSTRUMENT'; id: InstrumentId; direction: 'up' | 'down' }
  | { type: 'SET_STEP'; step: SoundcheckStep }
  | { type: 'SET_CALIBRATION'; result: CalibrationResult }
  | { type: 'RESET_SESSION' };

export function soundcheckSessionReducer(
  state: SoundcheckSessionState,
  action: SoundcheckSessionAction,
): SoundcheckSessionState {
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
    case 'SET_CALIBRATION':
      return { ...state, calibration: action.result };
    case 'RESET_SESSION':
      return initialSessionState;
    default:
      return state;
  }
}
