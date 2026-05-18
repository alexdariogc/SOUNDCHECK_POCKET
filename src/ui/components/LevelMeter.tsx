import { StyleSheet, View } from 'react-native';

import { dbToMeterFraction } from '../../audio/signalQuality';
import { colors } from '../theme';

type Props = {
  meteringDb?: number;
  active?: boolean;
};

const SEGMENTS = 24;

export function LevelMeter({ meteringDb, active = false }: Props) {
  const level = active ? dbToMeterFraction(meteringDb) : 0;
  const litCount = Math.round(level * SEGMENTS);

  return (
    <View style={styles.track} accessibilityRole="progressbar">
      {Array.from({ length: SEGMENTS }, (_, i) => {
        const lit = i < litCount;
        const hot = i >= SEGMENTS - 4;
        return (
          <View
            key={i}
            style={[
              styles.segment,
              lit && (hot ? styles.segmentHot : styles.segmentLit),
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 3,
    height: 48,
    alignItems: 'flex-end',
  },
  segment: {
    flex: 1,
    borderRadius: 3,
    backgroundColor: colors.border,
    minHeight: 8,
    height: '100%',
  },
  segmentLit: {
    backgroundColor: colors.success,
  },
  segmentHot: {
    backgroundColor: colors.danger,
  },
});
