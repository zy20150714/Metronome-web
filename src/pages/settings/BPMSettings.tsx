import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../../contexts/MetronomeContext';
import { useTheme } from '../../contexts/ThemeContext';

const BPMSettings: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();

  const handleBPMChange = (value: number) => {
    dispatch({ type: 'SET_BPM', payload: Math.max(20, Math.min(300, value)) });
  };

  const presets = [
    { name: '慢速', bpm: 40, emoji: '🐢' },
    { name: '行板', bpm: 80, emoji: '🚶' },
    { name: '中速', bpm: 100, emoji: '🏃' },
    { name: '快板', bpm: 140, emoji: '🚀' },
    { name: '急板', bpm: 200, emoji: '⚡' },
  ];

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: theme.background }}
    >
      <div className="absolute inset-0 tech-bg grid-bg" />

      <div className="container mx-auto max-w-lg relative z-10 p-4 sm:p-6">
        <div className="mb-8">
          <Link
            to="/settings"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-lg font-semibold transition-all duration-300 hover-lift"
            style={{
              backgroundColor: theme.surface,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: theme.cornerRadius,
              boxShadow: theme.shadow
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </Link>
        </div>

        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              fontFamily: theme.id === 'tech' ? "'Orbitron', monospace" : "'Inter', sans-serif",
              color: theme.text
            }}
          >
            ⚡ 速度设置
          </h1>
          <p style={{ color: theme.textSecondary }}>调整每分钟节拍数（BPM）</p>
        </div>

        <div
          className="mb-6 p-6 rounded-2xl"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          <div className="text-center mb-6">
            <div
              className="text-6xl font-bold mb-2"
              style={{
                fontFamily: "'Orbitron', monospace",
                color: theme.primary
              }}
            >
              {state.bpm}
            </div>
            <div
              className="text-sm uppercase tracking-widest"
              style={{ color: theme.textSecondary }}
            >
              每分钟节拍数
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => handleBPMChange(state.bpm - 10)}
              className="w-14 h-14 rounded-full font-bold text-2xl transition-all hover:scale-110 active:scale-95"
              style={{
                backgroundColor: `${theme.primary}15`,
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            >
              -10
            </button>
            <input
              type="range"
              min="20"
              max="300"
              value={state.bpm}
              onChange={(e) => handleBPMChange(parseInt(e.target.value))}
              className="flex-1 h-3 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${((state.bpm - 20) / 280) * 100}%, ${theme.border} ${((state.bpm - 20) / 280) * 100}%, ${theme.border} 100%)`,
              }}
            />
            <button
              onClick={() => handleBPMChange(state.bpm + 10)}
              className="w-14 h-14 rounded-full font-bold text-2xl transition-all hover:scale-110 active:scale-95"
              style={{
                backgroundColor: `${theme.primary}15`,
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            >
              +10
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleBPMChange(state.bpm - 1)}
              className="w-12 h-12 rounded-full font-bold text-xl transition-all hover:scale-110 active:scale-95"
              style={{
                backgroundColor: `${theme.primary}10`,
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            >
              -
            </button>
            <input
              type="number"
              value={state.bpm}
              onChange={(e) => handleBPMChange(parseInt(e.target.value) || 20)}
              min="20"
              max="300"
              className="flex-1 py-3 px-4 rounded-xl text-center text-2xl font-bold transition-all duration-300 outline-none"
              style={{
                backgroundColor: `${theme.primary}10`,
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            />
            <button
              onClick={() => handleBPMChange(state.bpm + 1)}
              className="w-12 h-12 rounded-full font-bold text-xl transition-all hover:scale-110 active:scale-95"
              style={{
                backgroundColor: `${theme.primary}10`,
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            >
              +
            </button>
          </div>
        </div>

        <div
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text }}
          >
            快捷预设
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {presets.map((preset) => (
              <button
                key={preset.bpm}
                onClick={() => handleBPMChange(preset.bpm)}
                className={`p-3 rounded-xl text-center transition-all hover:scale-105 ${
                  state.bpm === preset.bpm ? 'ring-2' : ''
                }`}
                style={{
                  backgroundColor: state.bpm === preset.bpm ? theme.primary + '30' : `${theme.primary}10`,
                  border: `1px solid ${state.bpm === preset.bpm ? theme.primary : theme.border}`,
                }}
              >
                <div className="text-xl mb-1">{preset.emoji}</div>
                <div
                  className="text-sm font-bold"
                  style={{ color: state.bpm === preset.bpm ? theme.primary : theme.text }}
                >
                  {preset.bpm}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BPMSettings;
