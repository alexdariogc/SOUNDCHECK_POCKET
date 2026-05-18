import { CalibrationScreen } from '../calibration/CalibrationScreen';
import { InstrumentSelectScreen } from '../instruments/InstrumentSelectScreen';
import { useSoundcheckSession } from '../../session/SoundcheckSessionContext';
import { PlaceholderStepScreen } from './PlaceholderStepScreen';

export function SoundcheckFlow() {
  const { state } = useSoundcheckSession();

  switch (state.currentStep) {
    case 'instruments':
      return <InstrumentSelectScreen />;
    case 'calibration':
      return <CalibrationScreen />;
    case 'individual':
    case 'comparison':
    case 'fullBand':
    case 'checklist':
      return <PlaceholderStepScreen step={state.currentStep} />;
    default:
      return <InstrumentSelectScreen />;
  }
}
