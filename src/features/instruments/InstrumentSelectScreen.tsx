import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  INSTRUMENT_CATALOG,
  getInstrument,
  type InstrumentId,
} from '../../domain/instruments';
import { useSoundcheckSession } from '../../session/SoundcheckSessionContext';
import { PrimaryButton } from '../../ui/components/PrimaryButton';
import { StepScaffold } from '../../ui/components/StepScaffold';
import { colors, spacing } from '../../ui/theme';

export function InstrumentSelectScreen() {
  const { t } = useTranslation();
  const {
    state,
    toggleInstrument,
    moveInstrument,
    isInstrumentSelected,
    canAdvanceFromInstruments,
    goToNextStep,
  } = useSoundcheckSession();

  const selectedCount = state.instrumentOrder.length;

  const continueLabel = t('instruments.continue', { count: selectedCount });

  return (
    <StepScaffold
      step="instruments"
      title={t('instruments.selectTitle')}
      subtitle={t('instruments.selectSubtitle')}
      footer={
        <PrimaryButton
          label={continueLabel}
          disabled={!canAdvanceFromInstruments}
          onPress={goToNextStep}
        />
      }
    >
      <Text style={styles.sectionTitle}>{t('instruments.catalogSection')}</Text>
      <View style={styles.chipGrid}>
        {INSTRUMENT_CATALOG.map((instrument) => {
          const selected = isInstrumentSelected(instrument.id);
          return (
            <Pressable
              key={instrument.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              onPress={() => toggleInstrument(instrument.id)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                {t(instrument.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selectedCount > 0 ? (
        <>
          <Text style={styles.sectionTitle}>{t('instruments.orderSection')}</Text>
          <Text style={styles.sectionHint}>{t('instruments.orderHint')}</Text>
          <View style={styles.orderList}>
            {state.instrumentOrder.map((id: InstrumentId, index: number) => {
              const instrument = getInstrument(id);
              const name = t(instrument.labelKey);
              return (
                <View key={id} style={styles.orderRow}>
                  <View style={styles.orderIndex}>
                    <Text style={styles.orderIndexText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.orderLabel}>{name}</Text>
                  <View style={styles.orderActions}>
                    <Pressable
                      accessibilityLabel={t('instruments.moveUpA11y', { name })}
                      disabled={index === 0}
                      onPress={() => moveInstrument(id, 'up')}
                      style={[styles.orderBtn, index === 0 && styles.orderBtnDisabled]}
                    >
                      <Text style={styles.orderBtnText}>↑</Text>
                    </Pressable>
                    <Pressable
                      accessibilityLabel={t('instruments.moveDownA11y', { name })}
                      disabled={index === state.instrumentOrder.length - 1}
                      onPress={() => moveInstrument(id, 'down')}
                      style={[
                        styles.orderBtn,
                        index === state.instrumentOrder.length - 1 && styles.orderBtnDisabled,
                      ]}
                    >
                      <Text style={styles.orderBtnText}>↓</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        </>
      ) : null}
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  sectionHint: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: -spacing.xs,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: 999,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.accent,
  },
  chipLabel: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '500',
  },
  chipLabelSelected: {
    color: colors.text,
    fontWeight: '600',
  },
  orderList: {
    gap: spacing.sm,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderIndexText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 14,
  },
  orderLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  orderActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  orderBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderBtnDisabled: {
    opacity: 0.35,
  },
  orderBtnText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
});
