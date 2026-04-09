import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';

const BeatDisplay: React.FC = () => {
  const { state } = useMetronome();
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

  const totalBeats = parseInt(state.timeSignature.split('/')[0]);

  return (
    <div className="bg-blue-600 rounded-xl p-6 mb-6 shadow-lg hover-lift">
      <div className="flex flex-col items-center">
        <div className={`text-white text-6xl font-bold mb-2 transition-all duration-100 ${flash ? 'scale-110 animate-pulseSoft' : ''}`}>
          {state.bpm}
        </div>
        <div className="text-white/80 text-sm mb-4">BPM</div>
        
        <div className="flex items-center justify-center mb-6 animate-bounceSoft">
          <div className="text-white text-3xl font-semibold">{state.timeSignature}</div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-2 w-full max-w-full">
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
                return 'ring-4 ring-white/50';
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
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ease-in-out 
                  ${getColor()} 
                  ${getRingColor()}
                  ${getAnimation()}
                  opacity-100 hover:scale-110
                `}
              >
                <span className={`${isCurrent ? 'text-white font-bold' : 'text-white/70'}`}>
                  {beatNumber}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 flex items-center space-x-4 text-white/80 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>首拍</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-white"></div>
            <span>普通拍</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatDisplay;