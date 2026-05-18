import {
  AudioModule,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

import { calibrationRecordingOptions } from './calibrationRecordingOptions';
import {
  GOOD_SIGNAL_HOLD_MS,
  pushMeterSample,
  resolveSignalQuality,
  type SignalQuality,
} from './signalQuality';

export type MicPermission = 'unknown' | 'granted' | 'denied';

export function useCalibrationMeter() {
  const recorder = useAudioRecorder(calibrationRecordingOptions);
  const recorderState = useAudioRecorderState(recorder, 100);
  const [permission, setPermission] = useState<MicPermission>('unknown');
  const [listening, setListening] = useState(false);
  const [recentSamples, setRecentSamples] = useState<number[]>([]);
  const [goodSince, setGoodSince] = useState<number | null>(null);
  const stoppingRef = useRef(false);

  const meteringDb = recorderState.metering;
  const signal = resolveSignalQuality(listening, meteringDb, recentSamples);

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
        });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!listening || meteringDb == null || !Number.isFinite(meteringDb)) return;
    setRecentSamples((prev) => pushMeterSample(prev, meteringDb));
  }, [listening, meteringDb]);

  useEffect(() => {
    if (signal === 'good') {
      setGoodSince((prev) => prev ?? Date.now());
    } else {
      setGoodSince(null);
    }
  }, [signal]);

  const stopListening = useCallback(async () => {
    if (stoppingRef.current) return;
    stoppingRef.current = true;
    try {
      if (recorderState.isRecording) {
        await recorder.stop();
      }
    } finally {
      stoppingRef.current = false;
      setListening(false);
      setRecentSamples([]);
      setGoodSince(null);
    }
  }, [recorder, recorderState.isRecording]);

  const startListening = useCallback(async () => {
    if (permission !== 'granted') return;
    setRecentSamples([]);
    setGoodSince(null);
    await recorder.prepareToRecordAsync();
    recorder.record();
    setListening(true);
  }, [permission, recorder]);

  useEffect(() => {
    return () => {
      void stopListening();
    };
  }, [stopListening]);

  const goodHeldMs =
    goodSince != null && signal === 'good' ? Date.now() - goodSince : 0;
  const canAdvance = listening && signal === 'good' && goodHeldMs >= GOOD_SIGNAL_HOLD_MS;

  return {
    permission,
    listening,
    meteringDb,
    signal,
    canAdvance,
    goodHeldMs,
    startListening,
    stopListening,
    toggleListening: listening ? stopListening : startListening,
  };
}
