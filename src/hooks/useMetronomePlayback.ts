import { useEffect, useRef, useCallback } from 'react';
import { useMetronome } from '../contexts/MetronomeContext';
import { calculateSubdivisionDuration, getSubdivisionConfig } from '../utils/metronomeUtils';
import { audioUtils } from '../utils/audioUtils';

export const useMetronomePlayback = () => {
  const { state, dispatch } = useMetronome();
  const timeoutRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  
  const clearAllTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  
  const playNextBeat = useCallback(() => {
    if (!isPlayingRef.current) {
      clearAllTimeouts();
      return;
    }
    
    const isAccent = state.currentBeat === 1 && state.currentSubdivision === 1;
    const volume = isAccent ? state.volume.accent : state.volume.normal;
    
    try {
      audioUtils.playSound(
        state.soundType,
        isAccent,
        false,
        volume,
      );
    } catch (error) {
      console.error('Error playing sound:', error);
    }
    
    const subdivisionDuration = calculateSubdivisionDuration(state.bpm, state.subdivision);
    const config = getSubdivisionConfig(state.subdivision);
    const subdivisionsPerBeat = Math.ceil(config.beatMultiplier);
    
    const currentSubdivision = state.currentSubdivision;
    const currentMaxSubdivision = subdivisionsPerBeat;
    
    timeoutRef.current = setTimeout(() => {
      if (isPlayingRef.current) {
        if (currentSubdivision < currentMaxSubdivision) {
          dispatch({ type: 'NEXT_SUBDIVISION' });
        } else {
          dispatch({ type: 'NEXT_BEAT' });
        }
      }
    }, subdivisionDuration) as unknown as number;
  }, [state.currentBeat, state.currentSubdivision, state.bpm, state.subdivision, state.soundType, state.volume, dispatch]);
  
  useEffect(() => {
    isPlayingRef.current = state.isPlaying;
    
    if (state.isPlaying) {
      playNextBeat();
    } else {
      clearAllTimeouts();
    }
  }, [state.isPlaying, state.timeSignature, playNextBeat]);
  
  useEffect(() => {
    if (state.isPlaying) {
      clearAllTimeouts();
      playNextBeat();
    }

    return () => {
      clearAllTimeouts();
    };
  }, [state.currentBeat, state.currentSubdivision, state.bpm, state.subdivision, state.soundType, state.volume, dispatch, playNextBeat, state.isPlaying]);
};
