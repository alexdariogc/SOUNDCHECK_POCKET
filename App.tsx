import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SoundcheckFlow } from './src/features/flow/SoundcheckFlow';
import { SoundcheckSessionProvider } from './src/session/SoundcheckSessionContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <SoundcheckSessionProvider>
        <SoundcheckFlow />
        <StatusBar style="light" />
      </SoundcheckSessionProvider>
    </SafeAreaProvider>
  );
}
