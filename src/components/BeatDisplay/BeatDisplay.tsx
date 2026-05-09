import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';
import { calculateSubdivisionDuration } from '../../utils/metronomeUtils';

const BeatDisplay: React.FC = () => {
  const { state } = useMetronome();
  const [flash, setFlash] = useState(false);
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
      flashTimerRef.current = setTimeout(() => setFlash(false), 150);
      const subdivisionDuration = calculateSubdivisionDuration(state.bpm, state.subdivision);
      visibilityTimerRef.current = setTimeout(() => {
      }, subdivisionDuration);
    } else {
      setFlash(false);
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
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 rounded-full blur-xl animate-fadeInOut"></div>
          )}
        </div>

        <div className="flex items-center justify-center mb-8 sm:mb-10">
          <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">{state.timeSignature}</div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-full mb-6 sm:mb-8">
          {Array.from({ length: totalBeats }, (_, i) => renderBeat(i))}
        </div>

        <div className="flex items-center space-x-6 sm:space-x-8 text-gray-400 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shadow-md shadow-pink-500/50"></div>
            <span>重音拍</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-md shadow-cyan-500/50"></div>
            <span>普通拍</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BeatDisplay);
