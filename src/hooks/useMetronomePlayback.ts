import { useEffect, useRef, useCallback } from 'react';
import { useMetronome } from '../contexts/MetronomeContext';
import { calculateSubdivisionDuration, getSubdivisionConfig } from '../utils/metronomeUtils';
import { audioUtils } from '../utils/audioUtils';

const SCHEDULE_AHEAD_TIME = 0.1;
const LOOKAHEAD = 25;

export const useMetronomePlayback = () => {
  const { state, dispatch } = useMetronome();
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentBeatRef = useRef(1);
  const currentSubdivisionRef = useRef(1);
  const timerRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const scheduledBeatsRef = useRef<{ time: number; beat: number; subdivision: number; isAccent: boolean }[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const getTotalBeats = useCallback(() => {
    return parseInt(state.timeSignature.split('/')[0]);
  }, [state.timeSignature]);

  const getSubdivisionsPerBeat = useCallback(() => {
    const config = getSubdivisionConfig(state.subdivision);
    return Math.ceil(config.beatMultiplier);
  }, [state.subdivision]);

  const nextNote = useCallback(() => {
    const secondsPerBeat = 60.0 / state.bpm;
    const subdivisionsPerBeat = getSubdivisionsPerBeat();
    const secondsPerSubdivision = secondsPerBeat / subdivisionsPerBeat;

    nextNoteTimeRef.current += secondsPerSubdivision;

    if (currentSubdivisionRef.current < subdivisionsPerBeat) {
      currentSubdivisionRef.current++;
    } else {
      currentSubdivisionRef.current = 1;
      const totalBeats = getTotalBeats();
      if (currentBeatRef.current >= totalBeats) {
        currentBeatRef.current = 1;
      } else {
        currentBeatRef.current++;
      }
    }
  }, [state.bpm, getSubdivisionsPerBeat, getTotalBeats]);

  const scheduleNote = useCallback((beatNumber: number, subdivisionNumber: number, time: number) => {
    const isAccent = beatNumber === 1 && subdivisionNumber === 1;
    const volume = isAccent ? state.volume.accent : state.volume.normal;

    scheduledBeatsRef.current.push({
      time,
      beat: beatNumber,
      subdivision: subdivisionNumber,
      isAccent
    });

    try {
      audioUtils.scheduleSound(
        state.soundType,
        isAccent,
        false,
        volume,
        time
      );
    } catch (error) {
      console.error('Error scheduling sound:', error);
    }
  }, [state.soundType, state.volume]);

  const scheduler = useCallback(() => {
    if (!audioContextRef.current) return;

    while (nextNoteTimeRef.current < audioContextRef.current.currentTime + SCHEDULE_AHEAD_TIME) {
      scheduleNote(
        currentBeatRef.current,
        currentSubdivisionRef.current,
        nextNoteTimeRef.current
      );
      nextNote();
    }
  }, [scheduleNote, nextNote]);

  const updateVisuals = useCallback(() => {
    if (!audioContextRef.current || !isPlayingRef.current) return;

    const currentTime = audioContextRef.current.currentTime;

    while (
      scheduledBeatsRef.current.length > 0 &&
      scheduledBeatsRef.current[0].time <= currentTime
    ) {
      const beatInfo = scheduledBeatsRef.current.shift()!;
      
      if (beatInfo.subdivision === 1) {
        dispatch({ type: 'SET_CURRENT_BEAT', payload: beatInfo.beat });
      }
      dispatch({ type: 'SET_CURRENT_SUBDIVISION', payload: beatInfo.subdivision });
    }

    animationFrameRef.current = requestAnimationFrame(updateVisuals);
  }, [dispatch]);

  const startPlayback = useCallback(() => {
    const ctx = audioUtils.getAudioContext();
    if (!ctx) return;

    audioContextRef.current = ctx;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    currentBeatRef.current = 1;
    currentSubdivisionRef.current = 1;
    nextNoteTimeRef.current = ctx.currentTime + 0.05;
    scheduledBeatsRef.current = [];
    isPlayingRef.current = true;

    const runScheduler = () => {
      if (!isPlayingRef.current) return;
      scheduler();
      timerRef.current = window.setTimeout(runScheduler, LOOKAHEAD);
    };
    runScheduler();

    animationFrameRef.current = requestAnimationFrame(updateVisuals);
  }, [scheduler, updateVisuals]);

  const stopPlayback = useCallback(() => {
    isPlayingRef.current = false;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    scheduledBeatsRef.current = [];
    currentBeatRef.current = 1;
    currentSubdivisionRef.current = 1;

    dispatch({ type: 'RESET_BEAT' });
  }, [dispatch]);

  useEffect(() => {
    if (state.isPlaying) {
      startPlayback();
    } else {
      stopPlayback();
    }

    return () => {
      stopPlayback();
    };
  }, [state.isPlaying, startPlayback, stopPlayback]);

  useEffect(() => {
    if (isPlayingRef.current && audioContextRef.current) {
      scheduledBeatsRef.current = [];
      currentBeatRef.current = state.currentBeat;
      currentSubdivisionRef.current = state.currentSubdivision;
      nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.05;
    }
  }, [state.bpm, state.timeSignature, state.subdivision, state.soundType, state.volume]);
};
