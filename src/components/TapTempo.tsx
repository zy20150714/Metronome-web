import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { audioUtils } from '../utils/audioUtils';

interface TapTempoProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (bpm: number) => void;
}

const TapTempo: React.FC<TapTempoProps> = ({ isOpen, onClose, onApply }) => {
  const { theme } = useTheme();
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [bpm, setBpm] = useState<number | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const lastTapRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const resetTaps = useCallback(() => {
    setTapTimes([]);
    setBpm(null);
    setTapCount(0);
    lastTapRef.current = 0;
  }, []);

  const handleTap = useCallback(() => {
    const now = Date.now();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      resetTaps();
    }, 3000);

    if (lastTapRef.current === 0 || now - lastTapRef.current > 3000) {
      setTapTimes([now]);
      setTapCount(1);
      setBpm(null);
      lastTapRef.current = now;
      return;
    }

    const newTimes = [...tapTimes, now];
    if (newTimes.length > 8) {
      newTimes.shift();
    }

    setTapTimes(newTimes);
    setTapCount(newTimes.length);
    lastTapRef.current = now;

    if (newTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTimes.length; i++) {
        intervals.push(newTimes[i] - newTimes[i - 1]);
      }
      
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      
      if (calculatedBpm >= 20 && calculatedBpm <= 300) {
        setBpm(calculatedBpm);
      }
    }

    try {
      audioUtils.playSound('click', tapCount % 4 === 0, false, 60);
    } catch (e) {
      // ignore
    }
  }, [tapTimes, tapCount, resetTaps]);

  const handleApply = () => {
    if (bpm) {
      onApply(bpm);
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      resetTaps();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, resetTaps]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' && isOpen) {
        e.preventDefault();
        handleTap();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, handleTap, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" />
      <div
        className="relative w-full max-w-md mx-4 animate-slideUp"
        style={{
          backgroundColor: theme.background,
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          border: `1px solid ${theme.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: theme.border }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.text }}>敲击测速</h2>
            <p className="text-sm mt-0.5" style={{ color: theme.textSecondary }}>
              跟着节奏点击测量 BPM
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: `${theme.text}10` }}
          >
            <svg className="w-5 h-5" style={{ color: theme.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          <div className="text-center mb-6">
            <div
              className="text-6xl font-bold mb-2"
              style={{
                fontFamily: theme.id === 'tech' ? "'Orbitron', monospace" : "'Inter', sans-serif",
                background: theme.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {bpm || '--'}
            </div>
            <div className="text-sm" style={{ color: theme.textSecondary }}>
              BPM
            </div>
            {tapCount > 0 && (
              <div className="text-xs mt-2" style={{ color: theme.textSecondary }}>
                已敲击 {tapCount} 次
              </div>
            )}
          </div>

          <button
            onClick={handleTap}
            className="w-full aspect-square max-w-[200px] mx-auto block rounded-full transition-all duration-100 active:scale-90"
            style={{
              background: theme.gradient,
              boxShadow: `0 8px 32px ${theme.glow}`,
            }}
          >
            <div className="text-white text-lg font-bold">
              点击 / 空格
            </div>
          </button>

          <p className="text-xs text-center mt-4" style={{ color: theme.textSecondary }}>
            至少敲击 2 次计算速度，3 秒无操作自动重置
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={resetTaps}
              className="flex-1 py-3.5 rounded-xl font-medium transition-all active:scale-95"
              style={{
                backgroundColor: `${theme.text}10`,
                color: theme.text,
              }}
            >
              重置
            </button>
            <button
              onClick={handleApply}
              disabled={!bpm}
              className="flex-1 py-3.5 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: theme.gradient,
                color: '#fff',
              }}
            >
              应用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TapTempo;
