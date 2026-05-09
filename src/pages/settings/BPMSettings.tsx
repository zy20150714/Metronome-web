import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../../contexts/MetronomeContext';
import { useTheme } from '../../contexts/ThemeContext';

const BPMSettings: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();

  const handleBPMChange = (value: number) => {
    dispatch({ type: 'SET_BPM', payload: value });
  };

  const presetBPMS = [
    { label: 'Largo', value: 50, icon: 'slow' },
    { label: 'Adagio', value: 70, icon: 'slow' },
    { label: 'Andante', value: 90, icon: 'medium' },
    { label: 'Moderato', value: 110, icon: 'medium' },
    { label: 'Allegro', value: 140, icon: 'fast' },
    { label: 'Presto', value: 180, icon: 'fast' },
  ];

  return (
    <div
      className="min-h-screen p-4 sm:p-6"
      style={{ backgroundColor: theme.background }}
    >
      <div className="container mx-auto max-w-lg">
        <div className="mb-8">
          <Link
            to="/settings"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-lg font-semibold transition-all duration-300"
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
            style={{ fontFamily: theme.id === 'tech' ? "'Orbitron', monospace" : "'Inter', sans-serif", color: theme.text }}
          >
            速度设置
          </h1>
          <p style={{ color: theme.textSecondary }}>调整每分钟节拍数 (BPM)</p>
        </div>

        <div
          className="mb-6 p-6"
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
                fontFamily: theme.id === 'tech' ? "'Orbitron', monospace" : "'Inter', sans-serif",
                color: theme.primary
              }}
            >
              {state.bpm}
            </div>
            <div style={{ color: theme.textSecondary }}>BPM</div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => handleBPMChange(Math.max(20, state.bpm - 1))}
              className="w-14 h-14 rounded-full font-bold text-2xl transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                backgroundColor: `${theme.primary}15`,
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            >
              -
            </button>
            <input
              type="number"
              value={state.bpm}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 20;
                const finalValue = Math.min(300, Math.max(20, value));
                dispatch({ type: 'SET_BPM', payload: finalValue });
              }}
              min="20"
              max="300"
              className="flex-1 py-4 px-4 rounded-xl text-center text-3xl font-bold transition-all duration-300 outline-none"
              style={{
                backgroundColor: `${theme.primary}10`,
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            />
            <button
              onClick={() => handleBPMChange(Math.min(300, state.bpm + 1))}
              className="w-14 h-14 rounded-full font-bold text-2xl transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                backgroundColor: `${theme.primary}15`,
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            >
              +
            </button>
          </div>

          <input
            type="range"
            min="20"
            max="300"
            value={state.bpm}
            onChange={(e) => handleBPMChange(parseInt(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${((state.bpm - 20) / 280) * 100}%, ${theme.border} ${((state.bpm - 20) / 280) * 100}%, ${theme.border} 100%)`,
              borderRadius: '15px'
            }}
          />
          <div className="flex justify-between mt-2" style={{ color: theme.textSecondary, fontSize: '12px' }}>
            <span>20</span>
            <span>160</span>
            <span>300</span>
          </div>
        </div>

        <div
          className="p-6"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          <div className="text-sm font-medium mb-4" style={{ color: theme.textSecondary }}>
            速度预设
          </div>
          <div className="grid grid-cols-3 gap-3">
            {presetBPMS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handleBPMChange(preset.value)}
                className={`py-3 px-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                  state.bpm === preset.value ? 'scale-105' : ''
                }`}
                style={{
                  backgroundColor: state.bpm === preset.value
                    ? theme.primary
                    : `${theme.primary}15`,
                  color: state.bpm === preset.value
                    ? '#fff'
                    : theme.text,
                  borderRadius: theme.cornerRadius,
                  boxShadow: state.bpm === preset.value
                    ? `0 4px 16px ${theme.glow}`
                    : 'none'
                }}
              >
                <div className="text-lg font-bold">{preset.value}</div>
                <div className="text-xs opacity-80">{preset.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BPMSettings;
