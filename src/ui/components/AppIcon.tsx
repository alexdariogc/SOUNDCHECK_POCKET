import { Image, StyleSheet, type ImageStyle, type StyleProp } from 'react-native';

/** Bundled UI asset (192px). Launcher/splash use assets/icon.png via app.json. */
const iconSource = require('../../../assets/app-icon.png');

type Props = {
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export function AppIcon({ size = 44, style }: Props) {
  return (
    <Image
      source={iconSource}
      style={[
        styles.icon,
        { width: size, height: size, borderRadius: size * 0.22 },
        style,
      ]}
      accessibilityIgnoresInvertColors
      accessibilityLabel="Soundcheck Pocket"
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'cover',
  },
});
