import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useMetronomePlayback } from '../hooks/useMetronomePlayback';
import { useTheme } from '../contexts/ThemeContext';
import ThemePicker from '../components/ThemePicker';
import TapTempo from '../components/TapTempo';
import Onboarding from '../components/Onboarding';

const Home: React.FC = () => {
  useMetronomePlayback();
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [isPressing, setIsPressing] = useState<'minus' | 'plus' | null>(null);
  const pressTimerRef = useRef<number | null>(null);
  const pressIntervalRef = useRef<number | null>(null);
  const bpmRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchStartBPM = useRef(120);

  const totalBeats = parseInt(state.timeSignature.split('/')[0]);

  const handleBPMChange = useCallback((value: number) => {
    dispatch({ type: 'SET_BPM', payload: Math.max(20, Math.min(300, value)) });
  }, [dispatch]);

  const handleTogglePlay = useCallback(() => {
    dispatch({ type: 'TOGGLE_PLAY' });
  }, [dispatch]);

  const startPress = (type: 'minus' | 'plus') => {
    setIsPressing(type);
    const delta = type === 'minus' ? -1 : 1;
    handleBPMChange(state.bpm + delta);
    
    pressTimerRef.current = window.setTimeout(() => {
      pressIntervalRef.current = window.setInterval(() => {
        handleBPMChange(state.bpm + delta);
      }, 100);
    }, 500);
  };

  const stopPress = () => {
    setIsPressing(null);
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (pressIntervalRef.current) {
      clearInterval(pressIntervalRef.current);
      pressIntervalRef.current = null;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartBPM.current = state.bpm;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = touchStartY.current - e.touches[0].clientY;
    const deltaBPM = Math.round(deltaY / 3);
    handleBPMChange(touchStartBPM.current + deltaBPM);
  };

  const handleDoubleClick = () => {
    dispatch({ type: 'SET_BPM', payload: 120 });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowUp' || e.code === 'ArrowRight') {
        e.preventDefault();
        handleBPMChange(state.bpm + 1);
      } else if (e.code === 'ArrowDown' || e.code === 'ArrowLeft') {
        e.preventDefault();
        handleBPMChange(state.bpm - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBPMChange, handleTogglePlay, state.bpm]);

  const getBPMTerm = (bpm: number) => {
    if (bpm < 40) return { term: 'Largo', label: '极慢' };
    if (bpm < 60) return { term: 'Largo', label: '广板' };
    if (bpm < 66) return { term: 'Larghetto', label: '稍广板' };
    if (bpm < 76) return { term: 'Adagio', label: '柔板' };
    if (bpm < 108) return { term: 'Andante', label: '行板' };
    if (bpm < 120) return { term: 'Moderato', label: '中板' };
    if (bpm < 156) return { term: 'Allegro', label: '快板' };
    if (bpm < 176) return { term: 'Vivace', label: '急板' };
    if (bpm < 200) return { term: 'Presto', label: '急板' };
    return { term: 'Prestissimo', label: '最急板' };
  };

  const bpmInfo = getBPMTerm(state.bpm);

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: theme.background }}
    >
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: theme.gradient, top: '-200px' }}
      />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: theme.id === 'tech' ? "'Orbitron', monospace" : "'Inter', sans-serif",
                letterSpacing: '0.03em',
                background: theme.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              节拍器
            </h1>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              专业节奏控制
            </p>
          </div>
          <button
            onClick={() => setShowThemePicker(true)}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90"
            style={{
              background: theme.gradient,
              boxShadow: `0 4px 16px ${theme.glow}`
            }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </button>
        </div>

        <div
          className="p-6 mb-5 text-center relative overflow-hidden"
          style={{
            backgroundColor: theme.surface,
            borderRadius: theme.cornerRadius,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow
          }}
        >
          <div
            ref={bpmRef}
            className="relative cursor-ns-resize select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onDoubleClick={handleDoubleClick}
          >
            <div
              className="text-[64px] font-bold leading-none mb-2"
              style={{
                fontFamily: theme.id === 'tech' ? "'Orbitron', monospace" : "'Inter', sans-serif",
                background: theme.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: `0 0 40px ${theme.glow}`
              }}
            >
              {state.bpm}
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span
                className="text-sm font-medium"
                style={{ color: theme.primary }}
              >
                {bpmInfo.term}
              </span>
              <span style={{ color: theme.border }}>·</span>
              <span className="text-xs" style={{ color: theme.textSecondary }}>
                {bpmInfo.label}
              </span>
            </div>
            <div
              className="text-xs tracking-widest uppercase"
              style={{ color: theme.textSecondary, opacity: 0.7 }}
            >
              BPM · 每分钟节拍数
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-5">
            <button
              onMouseDown={() => startPress('minus')}
              onMouseUp={stopPress}
              onMouseLeave={stopPress}
              onTouchStart={() => startPress('minus')}
              onTouchEnd={stopPress}
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90"
              style={{
                backgroundColor: `${theme.primary}15`,
                border: `1px solid ${theme.primary}30`,
              }}
            >
              <span style={{ color: theme.primary, fontSize: '22px', fontWeight: 'bold' }}>−</span>
            </button>
            
            <div className="flex-1">
              <input
                type="range"
                min="20"
                max="300"
                value={state.bpm}
                onChange={(e) => handleBPMChange(parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.secondary} ${(state.bpm - 20) / 280 * 100}%, ${theme.text}15 ${(state.bpm - 20) / 280 * 100}%, ${theme.text}15 100%)`,
                }}
              />
            </div>

            <button
              onMouseDown={() => startPress('plus')}
              onMouseUp={stopPress}
              onMouseLeave={stopPress}
              onTouchStart={() => startPress('plus')}
              onTouchEnd={stopPress}
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90"
              style={{
                backgroundColor: `${theme.primary}15`,
                border: `1px solid ${theme.primary}30`,
              }}
            >
              <span style={{ color: theme.primary, fontSize: '22px', fontWeight: 'bold' }}>+</span>
            </button>
          </div>
        </div>

        <div
          className="p-5 mb-5"
          style={{
            backgroundColor: theme.surface,
            borderRadius: theme.cornerRadius,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span style={{ color: theme.textSecondary, fontSize: '11px', letterSpacing: '0.1em' }}>
              节拍指示器
            </span>
            <span
              className="text-sm font-bold"
              style={{
                fontFamily: theme.id === 'tech' ? "'Orbitron', monospace" : "'Inter', sans-serif",
                color: theme.primary
              }}
            >
              {state.timeSignature}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalBeats }).map((_, i) => {
              const beatNum = i + 1;
              const isCurrent = beatNum === state.currentBeat && state.isPlaying;
              const isAccent = beatNum === 1;

              return (
                <div
                  key={beatNum}
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-150"
                  style={{
                    backgroundColor: isCurrent
                      ? isAccent ? theme.primary : theme.secondary
                      : isAccent
                        ? `${theme.primary}20`
                        : `${theme.text}08`,
                    border: isCurrent ? 'none' : `1px solid ${theme.border}`,
                    boxShadow: isCurrent ? `0 0 16px ${theme.glow}` : 'none',
                    transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                    color: isCurrent ? '#ffffff' : theme.textSecondary
                  }}
                >
                  {beatNum}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleTogglePlay}
            className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90"
            style={{
              background: state.isPlaying
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : theme.gradient,
              boxShadow: state.isPlaying 
                ? '0 0 30px rgba(239, 68, 68, 0.5)' 
                : `0 8px 32px ${theme.glow}`
            }}
          >
            {state.isPlaying ? (
              <div className="flex gap-1.5">
                <div className="w-2 h-7 bg-white rounded-sm md:w-2.5 md:h-8" />
                <div className="w-2 h-7 bg-white rounded-sm md:w-2.5 md:h-8" />
              </div>
            ) : (
              <div className="w-0 h-0 border-t-[14px] border-t-transparent border-l-[24px] border-l-white border-b-[14px] border-b-transparent ml-1 md:border-t-[16px] md:border-l-[28px] md:border-b-[16px]" />
            )}
            {state.isPlaying && (
              <>
                <div 
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
                />
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5 mb-6">
          <Link
            to="/settings"
            className="p-4 text-center transition-all duration-300 active:scale-95"
            style={{
              backgroundColor: theme.surface,
              borderRadius: theme.cornerRadius,
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="text-xl mb-1">⚙️</div>
            <span className="text-xs font-medium" style={{ color: theme.text }}>参数</span>
          </Link>

          <Link
            to="/sound"
            className="p-4 text-center transition-all duration-300 active:scale-95"
            style={{
              backgroundColor: theme.surface,
              borderRadius: theme.cornerRadius,
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="text-xl mb-1">🔊</div>
            <span className="text-xs font-medium" style={{ color: theme.text }}>声音</span>
          </Link>

          <button
            onClick={() => setShowThemePicker(true)}
            className="p-4 text-center transition-all duration-300 active:scale-95"
            style={{
              backgroundColor: theme.surface,
              borderRadius: theme.cornerRadius,
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="text-xl mb-1">🎨</div>
            <span className="text-xs font-medium" style={{ color: theme.text }}>主题</span>
          </button>

          <Link
            to="/system"
            className="p-4 text-center transition-all duration-300 active:scale-95"
            style={{
              backgroundColor: theme.surface,
              borderRadius: theme.cornerRadius,
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="text-xl mb-1">🔧</div>
            <span className="text-xs font-medium" style={{ color: theme.text }}>系统</span>
          </Link>
        </div>

        <div
          className="p-4"
          style={{
            backgroundColor: `${theme.primary}08`,
            borderRadius: theme.cornerRadius,
            border: `1px solid ${theme.primary}20`
          }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${theme.primary}20` }}
            >
              <span className="text-sm">💡</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium mb-1" style={{ color: theme.text }}>
                使用小技巧
              </p>
              <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                上下滑动 BPM 数字快速调速，双击回到 120。空格键播放/暂停，方向键微调速度。
              </p>
            </div>
          </div>
        </div>
      </div>

      <ThemePicker isOpen={showThemePicker} onClose={() => setShowThemePicker(false)} />
    </div>
  );
};

export default Home;
