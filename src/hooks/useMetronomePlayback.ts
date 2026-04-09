import { useEffect, useRef } from 'react';
import { useMetronome } from '../contexts/MetronomeContext';
import { calculateBeatDuration } from '../utils/metronomeUtils';
import { audioUtils } from '../utils/audioUtils';

export const useMetronomePlayback = () => {
  const { state, dispatch } = useMetronome();
  const timeoutRef = useRef<number | null>(null);
  const wasPlayingRef = useRef(false);
  
  const clearAllTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  
  const playBeat = () => {
    if (!state.isPlaying) {
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
    
    const beatDuration = calculateBeatDuration(state.bpm, state.noteValue);
    const subdivisionDuration = beatDuration / state.subdivision;
    
    const currentSubdivision = state.currentSubdivision;
    const currentMaxSubdivision = state.subdivision;
    
    timeoutRef.current = setTimeout(() => {
      if (currentSubdivision < currentMaxSubdivision) {
        dispatch({ type: 'NEXT_SUBDIVISION' });
      } else {
        dispatch({ type: 'NEXT_BEAT' });
      }
    }, subdivisionDuration) as unknown as number;
  };
  
  useEffect(() => {
    if (state.isPlaying) {
      playBeat();
      wasPlayingRef.current = true;
    } else {
      clearAllTimeouts();
      wasPlayingRef.current = false;
    }
  }, [state.isPlaying, state.timeSignature]);
  
  useEffect(() => {
    if (state.isPlaying && wasPlayingRef.current) {
      playBeat();
    }
  }, [state.currentBeat, state.currentSubdivision, state.bpm, state.noteValue, state.subdivision, state.soundType, state.volume, dispatch]);
};