import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SoundcheckFlow } from './src/features/flow/SoundcheckFlow';
import { SoundcheckSessionProvider } from './src/session/SoundcheckSessionContext';
import { SplashGate } from './src/ui/SplashGate';

export default function App() {
  return (
    <SplashGate>
      <SafeAreaProvider>
        <SoundcheckSessionProvider>
          <SoundcheckFlow />
          <StatusBar style="light" />
        </SoundcheckSessionProvider>
      </SafeAreaProvider>
    </SplashGate>
  );
}
