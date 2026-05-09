import { useEffect, useRef, useCallback } from 'react';
import { useMetronome } from '../contexts/MetronomeContext';
import { calculateSubdivisionDuration, getSubdivisionConfig } from '../utils/metronomeUtils';
import { audioUtils } from '../utils/audioUtils';

export const useMetronomePlayback = () => {
  const { state, dispatch } = useMetronome();
  const intervalRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const clearMyInterval = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const tick = useCallback(() => {
    const currentState = stateRef.current;
    const config = getSubdivisionConfig(currentState.subdivision);
    const subdivisionsPerBeat = Math.ceil(config.beatMultiplier);

    const isAccent = currentState.currentBeat === 1 && currentState.currentSubdivision === 1;
    const volume = isAccent ? currentState.volume.accent : currentState.volume.normal;

    try {
      audioUtils.playSound(currentState.soundType, isAccent, false, volume);
    } catch (error) {
      console.error('Error playing sound:', error);
    }

    if (currentState.currentSubdivision < subdivisionsPerBeat) {
      dispatch({ type: 'NEXT_SUBDIVISION' });
    } else {
      dispatch({ type: 'NEXT_BEAT' });
    }
  }, [dispatch]);

  useEffect(() => {
    isPlayingRef.current = state.isPlaying;

    if (state.isPlaying) {
      const subdivisionDuration = calculateSubdivisionDuration(state.bpm, state.subdivision);
      
      tick();

      intervalRef.current = window.setInterval(() => {
        if (!isPlayingRef.current) {
          clearMyInterval();
          return;
        }
        tick();
      }, subdivisionDuration);
    } else {
      clearMyInterval();
      dispatch({ type: 'RESET_BEAT' });
    }

    return () => {
      clearMyInterval();
    };
  }, [state.isPlaying, tick, dispatch]);

  useEffect(() => {
    if (state.isPlaying) {
      clearMyInterval();
      const subdivisionDuration = calculateSubdivisionDuration(state.bpm, state.subdivision);
      
      tick();

      intervalRef.current = window.setInterval(() => {
        if (!isPlayingRef.current) {
          clearMyInterval();
          return;
        }
        tick();
      }, subdivisionDuration);
    }

    return () => {
      clearMyInterval();
    };
  }, [state.bpm, state.subdivision, state.soundType, state.volume.accent, state.volume.normal, state.isPlaying, tick]);
};
