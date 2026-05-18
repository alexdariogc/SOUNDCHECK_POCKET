import * as SplashScreen from 'expo-splash-screen';
import { ReactNode, useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  useColorScheme,
  View,
  type ImageSourcePropType,
} from 'react-native';

/** Bundled at 1080x1920 for full-screen cover (AAPT-safe PNG). */
const splashLight = require('../../assets/splash-ui-light.png') as ImageSourcePropType;
const splashDark = require('../../assets/splash-ui-dark.png') as ImageSourcePropType;

SplashScreen.preventAutoHideAsync();

type Props = {
  children: ReactNode;
};

export function SplashGate({ children }: Props) {
  const scheme = useColorScheme();
  const [appReady, setAppReady] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function prepare() {
      try {
        await SplashScreen.hideAsync();
      } finally {
        if (!cancelled) {
          setAppReady(true);
        }
      }
    }

    void prepare();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!appReady) {
      return;
    }
    const timer = setTimeout(() => setOverlayVisible(false), 400);
    return () => clearTimeout(timer);
  }, [appReady]);

  const splashSource = scheme === 'dark' ? splashDark : splashLight;
  const backdropColor = scheme === 'dark' ? '#000000' : '#ffffff';

  return (
    <View style={styles.root}>
      {appReady ? children : null}
      {overlayVisible ? (
        <View style={[styles.overlay, { backgroundColor: backdropColor }]}>
          <Image source={splashSource} style={styles.image} resizeMode="cover" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
