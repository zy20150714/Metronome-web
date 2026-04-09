import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';
import { useSystemSettings } from '../ControlPanel/SystemSettings';

const BeatDisplay: React.FC = () => {
  const { state } = useMetronome();
  const { settings } = useSystemSettings();
  const [flash, setFlash] = useState(false);
  const [isFirstBeatVisible, setIsFirstBeatVisible] = useState(true);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibilityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getBeatType = useCallback((beatNumber: number): 'first' | 'normal' => {
    return beatNumber === 1 ? 'first' : 'normal';
  }, []);

  useEffect(() => {
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
    }
    if (visibilityTimerRef.current) {
      clearTimeout(visibilityTimerRef.current);
    }

    if (state.isPlaying) {
      setFlash(true);
      flashTimerRef.current = setTimeout(() => setFlash(false), 100);

      setIsFirstBeatVisible(true);
      
      const beatDuration = 60000 / state.bpm;
      const subdivisionDuration = beatDuration / state.subdivision;
      
      visibilityTimerRef.current = setTimeout(() => {
        setIsFirstBeatVisible(false);
      }, subdivisionDuration);
    } else {
      setFlash(false);
      setIsFirstBeatVisible(true);
    }

    return () => {
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
      }
      if (visibilityTimerRef.current) {
        clearTimeout(visibilityTimerRef.current);
      }
    };
  }, [state.currentBeat, state.bpm, state.isPlaying, state.subdivision]);

  const totalBeats = useMemo(() => {
    return parseInt(state.timeSignature.split('/')[0]);
  }, [state.timeSignature]);

  return (
    <div className={`rounded-2xl p-4 sm:p-6 mb-6 shadow-xl hover-lift ${settings.darkMode ? 'bg-gradient-to-br from-blue-900 to-blue-700' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
      <div className="flex flex-col items-center">
        <div className={`text-white text-5xl sm:text-7xl font-bold mb-2 transition-all duration-100 ${flash ? 'scale-110 animate-pulseSoft' : ''}`}>
          {state.bpm}
        </div>
        <div className="text-white/90 text-sm mb-4 sm:mb-6">BPM</div>
        
        <div className="flex items-center justify-center mb-6 sm:mb-8 animate-bounceSoft">
          <div className="text-white text-3xl sm:text-4xl font-semibold">{state.timeSignature}</div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full max-w-full">
          {Array.from({ length: totalBeats }, (_, i) => {
            const beatNumber = i + 1;
            const beatType = getBeatType(beatNumber);
            const isCurrent = beatNumber === state.currentBeat;
            
            const getColor = () => {
              if (beatType === 'first') {
                return state.isPlaying && state.currentBeat === 1 && !isFirstBeatVisible ? 'bg-white/30' : 'bg-red-500';
              }
              return 'bg-white';
            };
            
            const getRingColor = () => {
              if (isCurrent) {
                return 'ring-4 ring-white/70';
              }
              return '';
            };
            
            const getAnimation = () => {
              if (isCurrent && state.isPlaying) {
                return 'animate-scale';
              }
              return '';
            };
            
            return (
              <div
                key={i}
                className={`w-16 sm:w-20 h-16 sm:h-20 rounded-full flex items-center justify-center transition-all duration-200 ease-in-out 
                  ${getColor()} 
                  ${getRingColor()}
                  ${getAnimation()}
                  opacity-100 hover:scale-110
                  shadow-lg
                `}
              >
                <span className={`${isCurrent ? 'text-white font-bold text-lg sm:text-xl' : 'text-white/70 text-base sm:text-lg'}`}>
                  {beatNumber}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 sm:mt-6 flex items-center space-x-4 sm:space-x-6 text-white/80 text-xs sm:text-sm">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-red-500 shadow-md"></div>
            <span>重音</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-white shadow-md"></div>
            <span>普通音</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BeatDisplay);