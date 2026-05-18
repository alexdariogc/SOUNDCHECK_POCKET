import { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  computeHoldProgress,
  secondsUntilAdvance,
} from '../../audio/calibrationAdvance';
import { useCalibrationMeter } from '../../audio/useCalibrationMeter';
import type { SignalQuality } from '../../audio/signalQuality';
import { useSoundcheckSession } from '../../session/SoundcheckSessionContext';
import { HoldProgressBar } from '../../ui/components/HoldProgressBar';
import { LevelMeter } from '../../ui/components/LevelMeter';
import { PrimaryButton } from '../../ui/components/PrimaryButton';
import { StepScaffold } from '../../ui/components/StepScaffold';
import { colors, spacing } from '../../ui/theme';

const SIGNAL_MESSAGE_KEYS: Record<SignalQuality, `calibration.signal.${SignalQuality}`> = {
  idle: 'calibration.signal.idle',
  tooLow: 'calibration.signal.tooLow',
  good: 'calibration.signal.good',
  high: 'calibration.signal.high',
  clipping: 'calibration.signal.clipping',
  noisy: 'calibration.signal.noisy',
};

export function CalibrationScreen() {
  const { t } = useTranslation();
  const { goToNextStep, goToPreviousStep, completeCalibration, state } = useSoundcheckSession();
  const {
    permission,
    listening,
    meteringDb,
    peakMeteringDb,
    signal,
    canAdvance,
    goodHeldMs,
    toggleListening,
  } = useCalibrationMeter();
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!listening || signal !== 'good') return;
    const id = setInterval(() => setTick((n) => n + 1), 200);
    return () => clearInterval(id);
  }, [listening, signal]);

  const holdProgress = computeHoldProgress(goodHeldMs, signal);
  const secondsLeft = secondsUntilAdvance(goodHeldMs, signal);

  const handleContinue = () => {
    completeCalibration({
      completedAt: Date.now(),
      peakMeteringDb,
    });
    goToNextStep();
  };

  const openSettings = () => {
    void Linking.openSettings();
  };

  return (
    <StepScaffold
      step="calibration"
      title={t('calibration.title')}
      subtitle={t('calibration.subtitle')}
      footer={
        <>
          <PrimaryButton
            label={t('common.continue')}
            onPress={handleContinue}
            disabled={!canAdvance}
          />
          <PrimaryButton
            label={t('common.back')}
            variant="secondary"
            onPress={goToPreviousStep}
            style={styles.backBtn}
          />
        </>
      }
    >
      <Text style={styles.sectionLabel}>{t('calibration.connectionTitle')}</Text>
      <Text style={styles.body}>{t('calibration.connectionBody')}</Text>
      <View style={styles.sources}>
        {(['recOut', 'auxOut', 'monitorOut', 'mainOut'] as const).map((key) => (
          <Text key={key} style={styles.sourceItem}>
            · {t(`calibration.sources.${key}`)}
          </Text>
        ))}
      </View>

      {state.calibration ? (
        <View style={styles.bannerOk}>
          <Text style={styles.bannerOkText}>{t('calibration.alreadyCompleted')}</Text>
        </View>
      ) : null}

      {permission === 'denied' ? (
        <View style={styles.bannerDanger}>
          <Text style={styles.bannerText}>{t('calibration.permissionDenied')}</Text>
          <PrimaryButton
            label={t('calibration.openSettings')}
            variant="secondary"
            onPress={openSettings}
            style={styles.settingsBtn}
          />
        </View>
      ) : null}

      <Text style={styles.sectionLabel}>{t('calibration.meterTitle')}</Text>
      <LevelMeter meteringDb={meteringDb} active={listening} />

      <View
        style={[
          styles.statusBox,
          signal === 'good' && styles.statusGood,
          (signal === 'high' || signal === 'clipping') && styles.statusWarn,
          (signal === 'tooLow' || signal === 'noisy') && styles.statusMuted,
        ]}
      >
        <Text style={styles.statusText}>{t(SIGNAL_MESSAGE_KEYS[signal])}</Text>
        {listening && signal === 'good' && holdProgress < 1 ? (
          <>
            <Text style={styles.holdHint}>
              {t('calibration.holdGood', { seconds: secondsLeft })}
            </Text>
            <HoldProgressBar progress={holdProgress} />
          </>
        ) : null}
        {canAdvance ? (
          <Text style={styles.holdHint}>{t('calibration.readyToContinue')}</Text>
        ) : null}
      </View>

      <PrimaryButton
        label={
          listening ? t('calibration.stopListening') : t('calibration.startListening')
        }
        onPress={toggleListening}
        disabled={permission !== 'granted'}
      />

      {permission === 'granted' && !listening ? (
        <Text style={styles.hint}>{t('calibration.startHint')}</Text>
      ) : null}

      {permission === 'unknown' ? (
        <Text style={styles.hint}>{t('calibration.requestingPermission')}</Text>
      ) : null}
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  body: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  sources: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  sourceItem: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  bannerOk: {
    backgroundColor: '#122018',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.success,
  },
  bannerOkText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  bannerDanger: {
    backgroundColor: '#3b1214',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.danger,
    gap: spacing.sm,
  },
  bannerText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  settingsBtn: {
    alignSelf: 'flex-start',
  },
  statusBox: {
    borderRadius: 12,
    padding: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  statusGood: {
    borderColor: colors.success,
  },
  statusWarn: {
    borderColor: colors.accent,
  },
  statusMuted: {
    borderColor: colors.border,
  },
  statusText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  holdHint: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  backBtn: {
    marginTop: spacing.sm,
  },
});
