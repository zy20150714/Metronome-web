import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';
import { useTheme } from '../../contexts/ThemeContext';

const BeatDisplay: React.FC = () => {
  const { state } = useMetronome();
  const { theme } = useTheme();
  const [flash, setFlash] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
    }

    if (state.isPlaying) {
      setFlash(true);
      flashTimerRef.current = setTimeout(() => setFlash(false), 100);
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
    const isCurrent = beatNumber === state.currentBeat;
    const isAccent = beatNumber === 1;

    let baseClass, shadowClass, glowClass;

    if (isAccent) {
      if (isCurrent && state.isPlaying) {
        baseClass = 'from-pink-500 to-rose-600';
        shadowClass = 'shadow-pink-500/60';
        glowClass = '0 0 20px rgba(236, 72, 153, 0.6), 0 0 40px rgba(236, 72, 153, 0.3)';
      } else {
        baseClass = 'from-pink-600/60 to-rose-700/60';
        shadowClass = 'shadow-pink-500/20';
        glowClass = 'none';
      }
    } else {
      if (isCurrent && state.isPlaying) {
        baseClass = 'from-cyan-400 to-blue-500';
        shadowClass = 'shadow-cyan-500/60';
        glowClass = '0 0 20px rgba(0, 212, 255, 0.6), 0 0 40px rgba(0, 212, 255, 0.3)';
      } else {
        baseClass = 'from-gray-700/60 to-gray-800/60';
        shadowClass = 'shadow-gray-500/20';
        glowClass = 'none';
      }
    }

    return (
      <div
        key={i}
        className={`w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl md:text-3xl transition-all duration-300 ease-out bg-gradient-to-br ${baseClass} hover:scale-105`}
        style={{
          boxShadow: isCurrent && state.isPlaying ? glowClass : `0 4px 15px ${shadowClass}`,
          transform: isCurrent && state.isPlaying ? 'scale(1.15)' : 'scale(1)',
          color: '#ffffff',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
        }}
      >
        {beatNumber}
      </div>
    );
  };

  return (
    <div
      className="rounded-2xl p-6 sm:p-8 mb-6 glass hover-lift"
      style={{
        boxShadow: theme.shadow
      }}
    >
      <div className="flex flex-col items-center">
        <div className="relative mb-6 sm:mb-8">
          <div
            className="text-6xl sm:text-8xl md:text-9xl font-bold transition-all duration-300"
            style={{
              fontFamily: "'Orbitron', monospace",
              background: theme.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              filter: state.isPlaying ? 'drop-shadow(0 0 20px rgba(255, 107, 0, 0.5))' : 'none'
            }}
          >
            {state.bpm}
          </div>
          <div
            className="text-gray-400 text-sm sm:text-base mt-2 tracking-widest uppercase"
            style={{ letterSpacing: '0.15em' }}
          >
            每分钟节拍数
          </div>
          {flash && (
            <div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}30, ${theme.secondary}30)`,
                animation: 'ping 0.3s ease-out'
              }}
            />
          )}
        </div>

        <div className="flex items-center justify-center mb-4">
          <span
            className="text-lg font-semibold mr-4"
            style={{ color: theme.textSecondary }}
          >
            {state.timeSignature}
          </span>
          <div
            className="w-16 h-1 rounded-full"
            style={{ background: theme.gradient }}
          />
          <span
            className="text-lg font-semibold ml-4"
            style={{ color: theme.textSecondary }}
          >
            {state.subdivision === 'quarter' ? '四分音符' :
             state.subdivision === 'eighth' ? '八分音符' :
             state.subdivision === 'sixteenth' ? '十六分音符' : '三连音'}
          </span>
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
            <div
              className="w-4 h-4 rounded-full mb-2 mx-auto animate-pulse"
              style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)' }}
            />
            <div className="text-xs text-gray-400">重音</div>
          </div>
          <div className="text-center">
            <div
              className="w-4 h-4 rounded-full mb-2 mx-auto"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)' }}
            />
            <div className="text-xs text-gray-400">普通</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatDisplay;
