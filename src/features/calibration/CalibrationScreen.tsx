import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  computeHoldProgress,
  secondsUntilAdvance,
} from '../../audio/calibrationAdvance';
import { formatAvailableInputNames } from '../../audio/consoleRecordingInput';
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
    meteringActive,
    meteringDb,
    peakMeteringDb,
    signal,
    inputStatus,
    checkingKind,
    verifyPhase,
    verifyError,
    silenceMetrics,
    silenceMaxPeakDb,
    silenceMaxStdDevDb,
    needsAndroidLineVerify,
    canAdvance,
    canListen,
    goodHeldMs,
    captureInput,
    stopListening,
    runSilenceCheck,
    runSignalCheck,
    toggleListening,
  } = useCalibrationMeter();
  const [, setTick] = useState(0);
  const [prepAcknowledged, setPrepAcknowledged] = useState(false);

  const showAndroidPrep =
    permission === 'granted' && needsAndroidLineVerify && !state.calibration;
  const verifyEnabled = !showAndroidPrep || prepAcknowledged;

  useEffect(() => {
    if (!listening || signal !== 'good') return;
    const id = setInterval(() => setTick((n) => n + 1), 200);
    return () => clearInterval(id);
  }, [listening, signal]);

  const holdProgress = computeHoldProgress(goodHeldMs, signal);
  const secondsLeft = secondsUntilAdvance(goodHeldMs, signal);

  const handleContinue = async () => {
    await stopListening();
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
            onPress={() => {
              void stopListening().then(goToPreviousStep);
            }}
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

      {showAndroidPrep ? (
        <View style={styles.bannerPrep}>
          <Text style={styles.prepTitle}>{t('calibration.prepTitle')}</Text>
          <Text style={styles.bannerSubtext}>{t('calibration.prepBody')}</Text>
          <Text style={styles.prepSteps}>{t('calibration.prepMuteSteps')}</Text>
          <Text style={styles.bannerSubtext}>{t('calibration.prepUsbNote')}</Text>
          <Text style={styles.bannerSubtext}>{t('calibration.prepTapTest')}</Text>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: prepAcknowledged }}
            onPress={() => setPrepAcknowledged((v) => !v)}
            style={styles.checkRow}
          >
            <View style={[styles.checkbox, prepAcknowledged && styles.checkboxOn]} />
            <Text style={styles.checkLabel}>{t('calibration.prepConfirm')}</Text>
          </Pressable>
          {!prepAcknowledged ? (
            <Text style={styles.prepHint}>{t('calibration.prepRequired')}</Text>
          ) : null}
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

      {permission === 'granted' && inputStatus === 'missing' ? (
        <View style={styles.bannerDanger}>
          <Text style={styles.bannerText}>{t('calibration.externalInputRequired')}</Text>
          {needsAndroidLineVerify ? (
            <>
              <Text style={styles.bannerSubtext}>{t('calibration.androidVerifyIntro')}</Text>
              {verifyError === 'silenceNoMetering' ? (
                <Text style={styles.bannerSubtext}>{t('calibration.silenceNoMetering')}</Text>
              ) : null}
              {verifyError === 'silenceFailed' ? (
                <>
                  <Text style={styles.bannerSubtext}>{t('calibration.silenceFailed')}</Text>
                  {silenceMetrics ? (
                    <Text style={styles.bannerSubtext}>
                      {t('calibration.silenceFailedMetrics', {
                        peak: Math.round(silenceMetrics.peak),
                        stdDev: Math.round(silenceMetrics.stdDev),
                        maxPeak: silenceMaxPeakDb,
                        maxStdDev: silenceMaxStdDevDb,
                      })}
                    </Text>
                  ) : null}
                </>
              ) : null}
              {verifyError === 'signalFailed' ? (
                <Text style={styles.bannerSubtext}>{t('calibration.signalFailed')}</Text>
              ) : null}
              {verifyPhase === 'silence_ok' ? (
                <Text style={styles.bannerSubtext}>{t('calibration.silenceOk')}</Text>
              ) : null}
              {verifyPhase !== 'silence_ok' ? (
                <PrimaryButton
                  label={t('calibration.verifySilence')}
                  variant="secondary"
                  onPress={() => {
                    void runSilenceCheck();
                  }}
                  disabled={inputStatus === 'checking' || !verifyEnabled}
                  style={styles.settingsBtn}
                />
              ) : null}
              {verifyPhase === 'silence_ok' ? (
                <PrimaryButton
                  label={t('calibration.verifySignal')}
                  variant="secondary"
                  onPress={() => {
                    void runSignalCheck();
                  }}
                  disabled={inputStatus === 'checking' || !verifyEnabled}
                  style={styles.settingsBtn}
                />
              ) : null}
            </>
          ) : null}
          {captureInput && captureInput.available.length > 0 ? (
            <Text style={styles.bannerSubtext}>
              {t('calibration.devicesSeen', {
                list: formatAvailableInputNames(captureInput.available),
              })}
            </Text>
          ) : null}
        </View>
      ) : null}

      {permission === 'granted' && inputStatus === 'checking' && checkingKind === 'system' ? (
        <Text style={styles.hint}>{t('calibration.checkingConnection')}</Text>
      ) : null}
      {permission === 'granted' && inputStatus === 'checking' && checkingKind === 'silence' ? (
        <Text style={styles.hint}>{t('calibration.verifyingSilence')}</Text>
      ) : null}
      {permission === 'granted' && inputStatus === 'checking' && checkingKind === 'signal' ? (
        <Text style={styles.hint}>{t('calibration.verifyingSignal')}</Text>
      ) : null}

      {permission === 'granted' && inputStatus === 'ready' && captureInput?.selected ? (
        <View style={styles.bannerOk}>
          <Text style={styles.bannerOkText}>
            {t('calibration.inputActive', { name: captureInput.selected.name })}
          </Text>
        </View>
      ) : null}

      <Text style={styles.sectionLabel}>{t('calibration.meterTitle')}</Text>
      {listening ? (
        <Text style={styles.bannerSubtext}>{t('calibration.meterWithoutSourceHint')}</Text>
      ) : null}
      <LevelMeter meteringDb={meteringDb} active={meteringActive} />

      <View
        style={[
          styles.statusBox,
          listening && signal === 'idle' && styles.statusListening,
          signal === 'good' && styles.statusGood,
          (signal === 'high' || signal === 'clipping') && styles.statusWarn,
          (signal === 'tooLow' || signal === 'noisy') && styles.statusMuted,
        ]}
      >
        <Text style={styles.statusText}>
          {listening && signal === 'idle'
            ? t('calibration.listening')
            : t(SIGNAL_MESSAGE_KEYS[signal])}
        </Text>
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
        disabled={!canListen && !listening}
      />

      {permission === 'granted' && inputStatus === 'ready' && !listening ? (
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
    backgroundColor: colors.successSurface,
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
  bannerPrep: {
    backgroundColor: colors.accentSurface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.accent,
    gap: spacing.sm,
  },
  prepTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  prepSteps: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.accent,
    marginTop: 1,
  },
  checkboxOn: {
    backgroundColor: colors.accent,
  },
  checkLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  prepHint: {
    color: colors.accent,
    fontSize: 13,
    lineHeight: 18,
  },
  bannerDanger: {
    backgroundColor: colors.dangerSurface,
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
  bannerSubtext: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
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
  statusListening: {
    borderColor: colors.accent,
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
  recheckBtn: {
    marginTop: spacing.sm,
  },
});
