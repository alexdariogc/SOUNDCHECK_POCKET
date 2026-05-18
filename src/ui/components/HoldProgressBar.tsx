import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../theme';

type Props = {
  progress: number;
};

export function HoldProgressBar({ progress }: Props) {
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 3,
  },
});
