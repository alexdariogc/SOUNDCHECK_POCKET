import { AudioModule, setAudioModeAsync, useAudioRecorder } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import {
  analyzeSignalProbe,
  analyzeSilenceProbe,
  ANDROID_SIGNAL_DETECTED_INPUT,
  probeLineSignalSamples,
  SILENCE_MAX_PEAK_DB,
  SILENCE_MAX_STD_DEV_DB,
} from './androidLineSignalProbe';
import {
  canAdvanceCalibration,
  computeGoodHeldMs,
  nextPeakMeteringDb,
} from './calibrationAdvance';
import { calibrationRecordingOptions } from './calibrationRecordingOptions';
import {
  applyConsoleRecordingInput,
  canUseConsoleCapture,
  type ConsoleInputSelection,
} from './consoleRecordingInput';
import { shouldPrepareRecorder } from './calibrationRecorderSession';
import { useRecorderMetering } from './useRecorderMetering';
import { pushMeterSample, resolveSignalQuality } from './signalQuality';

export type MicPermission = 'unknown' | 'granted' | 'denied';
export type ConsoleInputStatus = 'unknown' | 'checking' | 'ready' | 'missing';
export type LineVerifyPhase = 'none' | 'silence_ok' | 'failed';
export type LineVerifyError = 'silenceFailed' | 'silenceNoMetering' | 'signalFailed' | null;
export type CheckingKind = 'system' | 'silence' | 'signal' | null;

const INITIAL_PEAK_DB = -160;

async function ensureRecorderPrepared(
  recorder: ReturnType<typeof useAudioRecorder>,
): Promise<void> {
  const status = recorder.getStatus();
  if (shouldPrepareRecorder(status)) {
    await recorder.prepareToRecordAsync();
  }
}

export function useCalibrationMeter() {
  const recorder = useAudioRecorder(calibrationRecordingOptions);
  const [permission, setPermission] = useState<MicPermission>('unknown');
  const [inputStatus, setInputStatus] = useState<ConsoleInputStatus>('unknown');
  const [checkingKind, setCheckingKind] = useState<CheckingKind>(null);
  const [verifyPhase, setVerifyPhase] = useState<LineVerifyPhase>('none');
  const [verifyError, setVerifyError] = useState<LineVerifyError>(null);
  const [silenceBaselinePeak, setSilenceBaselinePeak] = useState<number | null>(
    null,
  );
  const [silenceMetrics, setSilenceMetrics] = useState<{
    peak: number;
    stdDev: number;
  } | null>(null);
  const [listening, setListening] = useState(false);
  const [recentSamples, setRecentSamples] = useState<number[]>([]);
  const [goodSince, setGoodSince] = useState<number | null>(null);
  const [peakMeteringDb, setPeakMeteringDb] = useState(INITIAL_PEAK_DB);
  const [captureInput, setCaptureInput] = useState<ConsoleInputSelection | null>(
    null,
  );
  const stoppingRef = useRef(false);
  const listeningRef = useRef(false);

  const meteringActive =
    listening || checkingKind === 'silence' || checkingKind === 'signal';
  const meteringDb = useRecorderMetering(recorder, meteringActive);
  const signal = resolveSignalQuality(listening, meteringDb, recentSamples);
  const hasConsoleInput = captureInput?.hasConsoleInput ?? false;
  const needsAndroidLineVerify = Platform.OS === 'android';

  const probeConsoleInput = useCallback(async () => {
    if (permission !== 'granted' || stoppingRef.current) return;
    setInputStatus('checking');
    setCheckingKind('system');
    setVerifyPhase('none');
    setVerifyError(null);
    setSilenceBaselinePeak(null);
    try {
      await ensureRecorderPrepared(recorder);
      const selection = applyConsoleRecordingInput(recorder);
      setCaptureInput(selection);

      if (needsAndroidLineVerify) {
        setInputStatus('missing');
        return;
      }

      setInputStatus(canUseConsoleCapture(selection) ? 'ready' : 'missing');
    } catch {
      setCaptureInput(null);
      setInputStatus('missing');
    } finally {
      setCheckingKind(null);
    }
  }, [needsAndroidLineVerify, permission, recorder]);

  const runSilenceCheck = useCallback(async () => {
    if (permission !== 'granted' || stoppingRef.current) return;
    setInputStatus('checking');
    setCheckingKind('silence');
    setVerifyError(null);
    try {
      await ensureRecorderPrepared(recorder);
      const selection = applyConsoleRecordingInput(recorder);
      setCaptureInput(selection);
      const { samples } = await probeLineSignalSamples(recorder);
      const result = analyzeSilenceProbe(samples);
      if (result.pass) {
        setSilenceBaselinePeak(result.peak);
        setSilenceMetrics(null);
        setVerifyPhase('silence_ok');
        setInputStatus('missing');
      } else {
        setSilenceMetrics({ peak: result.peak, stdDev: result.stdDev });
        setVerifyPhase('failed');
        setVerifyError(
          result.failure === 'no_metering' ? 'silenceNoMetering' : 'silenceFailed',
        );
        setInputStatus('missing');
      }
    } catch {
      setVerifyPhase('failed');
      setVerifyError('silenceFailed');
      setInputStatus('missing');
    } finally {
      setCheckingKind(null);
    }
  }, [permission, recorder]);

  const runSignalCheck = useCallback(async () => {
    if (permission !== 'granted' || stoppingRef.current || silenceBaselinePeak == null) {
      return;
    }
    setInputStatus('checking');
    setCheckingKind('signal');
    setVerifyError(null);
    try {
      await ensureRecorderPrepared(recorder);
      const { samples } = await probeLineSignalSamples(recorder);
      const result = analyzeSignalProbe(samples, silenceBaselinePeak);
      if (result.pass) {
        setCaptureInput((prev) => ({
          selected: ANDROID_SIGNAL_DETECTED_INPUT,
          available: prev?.available ?? [],
          hasConsoleInput: true,
        }));
        setInputStatus('ready');
        setVerifyPhase('none');
      } else {
        setVerifyPhase('failed');
        setVerifyError('signalFailed');
        setInputStatus('missing');
      }
    } catch {
      setVerifyPhase('failed');
      setVerifyError('signalFailed');
      setInputStatus('missing');
    } finally {
      setCheckingKind(null);
    }
  }, [permission, recorder, silenceBaselinePeak]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!mounted) return;
      setPermission(status.granted ? 'granted' : 'denied');
      if (status.granted) {
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
          interruptionMode: 'doNotMix',
        });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (permission !== 'granted') {
      setInputStatus('unknown');
      setCaptureInput(null);
      setVerifyPhase('none');
      return;
    }
    if (needsAndroidLineVerify) {
      setInputStatus('missing');
      setVerifyPhase('none');
      setVerifyError(null);
      return;
    }
    void probeConsoleInput();
  }, [needsAndroidLineVerify, permission, probeConsoleInput]);

  useEffect(() => {
    if (!listening || meteringDb == null || !Number.isFinite(meteringDb)) return;
    setRecentSamples((prev) => pushMeterSample(prev, meteringDb));
    setPeakMeteringDb((prev) => nextPeakMeteringDb(prev, meteringDb));
  }, [listening, meteringDb]);

  useEffect(() => {
    if (signal === 'good') {
      setGoodSince((prev) => prev ?? Date.now());
    } else {
      setGoodSince(null);
    }
  }, [signal]);

  useEffect(() => {
    listeningRef.current = listening;
  }, [listening]);

  const stopListening = useCallback(async () => {
    if (stoppingRef.current) return;
    stoppingRef.current = true;
    const wasListening = listeningRef.current;
    setListening(false);
    try {
      if (wasListening) {
        try {
          await recorder.stop();
        } catch {
          // Native recorder may already be released on unmount.
        }
      }
    } finally {
      stoppingRef.current = false;
      setRecentSamples([]);
      setGoodSince(null);
    }
  }, [recorder]);

  const startListening = useCallback(async () => {
    if (permission !== 'granted' || stoppingRef.current) return;

    await ensureRecorderPrepared(recorder);
    let selection = applyConsoleRecordingInput(recorder);

    if (
      !canUseConsoleCapture(selection) &&
      captureInput?.hasConsoleInput &&
      captureInput.selected?.uid === ANDROID_SIGNAL_DETECTED_INPUT.uid
    ) {
      selection = captureInput;
    }

    setCaptureInput(selection);

    if (!canUseConsoleCapture(selection)) {
      setInputStatus('missing');
      return;
    }

    setInputStatus('ready');
    setRecentSamples([]);
    setGoodSince(null);
    setPeakMeteringDb(INITIAL_PEAK_DB);

    if (!recorder.getStatus().isRecording) {
      recorder.record();
    }
    setListening(true);
  }, [captureInput, permission, recorder]);

  useEffect(() => {
    return () => {
      void stopListening();
    };
  }, [stopListening]);

  const goodHeldMs = computeGoodHeldMs(goodSince, signal);
  const canAdvance =
    hasConsoleInput &&
    canAdvanceCalibration({ listening, signal, goodHeldMs });

  const canListen =
    permission === 'granted' &&
    !listening &&
    checkingKind === null &&
    (inputStatus === 'ready' ||
      (needsAndroidLineVerify && inputStatus === 'missing'));

  return {
    permission,
    inputStatus,
    checkingKind,
    verifyPhase,
    verifyError,
    silenceMetrics,
    silenceMaxPeakDb: SILENCE_MAX_PEAK_DB,
    silenceMaxStdDevDb: SILENCE_MAX_STD_DEV_DB,
    needsAndroidLineVerify,
    hasConsoleInput,
    listening,
    meteringActive,
    meteringDb,
    peakMeteringDb,
    captureInput,
    signal,
    canAdvance,
    canListen,
    goodHeldMs,
    startListening,
    stopListening,
    probeConsoleInput,
    runSilenceCheck,
    runSignalCheck,
    toggleListening: listening ? stopListening : startListening,
  };
}
