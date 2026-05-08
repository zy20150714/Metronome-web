import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';

const BeatDisplay: React.FC = () => {
  const { state } = useMetronome();
  const [flash, setFlash] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getBeatType = useCallback((beatNumber: number): 'first' | 'normal' => {
    return beatNumber === 1 ? 'first' : 'normal';
  }, []);

  useEffect(() => {
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
    }

    if (state.isPlaying) {
      setFlash(true);
      flashTimerRef.current = setTimeout(() => setFlash(false), 150);
    } else {
      setFlash(false);
    }

    return () => {
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
      }
    };
  }, [state.currentBeat, state.bpm, state.isPlaying]);

  const totalBeats = useMemo(() => {
    return parseInt(state.timeSignature.split('/')[0]);
  }, [state.timeSignature]);

  const renderBeat = (i: number) => {
    const beatNumber = i + 1;
    const beatType = getBeatType(beatNumber);
    const isCurrent = beatNumber === state.currentBeat;
    let baseClass, shadowClass, ringClass, glowClass, animClass;

    if (beatType === 'first') {
      if (isCurrent && state.isPlaying) {
        baseClass = 'bg-gradient-to-br from-pink-500 to-rose-600';
        shadowClass = 'shadow-lg shadow-pink-500/50';
        ringClass = 'ring-4 ring-pink-400/50';
        glowClass = 'animate-glow';
      } else {
        baseClass = 'bg-gradient-to-br from-pink-600/50 to-rose-700/50';
        shadowClass = 'shadow-md';
        ringClass = '';
        glowClass = '';
      }
    } else if (isCurrent && state.isPlaying) {
      baseClass = 'bg-gradient-to-br from-cyan-400 to-blue-500';
      shadowClass = 'shadow-lg shadow-cyan-500/50';
      ringClass = 'ring-4 ring-cyan-400/50';
      glowClass = 'animate-glow';
    } else {
      baseClass = 'bg-gradient-to-br from-gray-700 to-gray-800';
      shadowClass = 'shadow-md';
      ringClass = '';
      glowClass = '';
    }

    animClass = isCurrent && state.isPlaying ? 'animate-scaleIn scale-110' : '';

    return (
      <div
        key={i}
        className={`w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 ease-out ${baseClass} ${ringClass} ${shadowClass} ${animClass} ${glowClass} hover:scale-105`}
      >
        <span className={`text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg`}>{beatNumber}</span>
      </div>
    );
  };

  return (
    <div className="rounded-2xl p-6 sm:p-8 mb-6 hover-lift glass">
      <div className="flex flex-col items-center">
        <div className="relative mb-6 sm:mb-8">
          <div className={`text-6xl sm:text-8xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent transition-all duration-300 animate-glow`}>{state.bpm}</div>
          <div className="text-gray-400 text-sm sm:text-base mt-2 tracking-widest uppercase">Beats Per Minute</div>
          {flash && (
            <div className="absolute inset-0 bg-white/20 rounded-lg animate-ping pointer-events-none" />
          )}
        </div>

        <div className="flex gap-4 sm:gap-6 mb-6 sm:mb-8">
          {Array.from({ length: totalBeats }).map((_, i) => (
            <div key={i} className="relative">
              {renderBeat(i)}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          <div className="text-center">
            <div className="w-4 h-4 rounded-full bg-pink-500 mb-2 mx-auto"></div>
            <div className="text-xs text-gray-400">重音</div>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 rounded-full bg-cyan-500 mb-2 mx-auto"></div>
            <div className="text-xs text-gray-400">普通</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatDisplay;
