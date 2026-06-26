import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useMetronomePlayback } from '../hooks/useMetronomePlayback';
import { useTheme } from '../contexts/ThemeContext';

const Home: React.FC = () => {
  useMetronomePlayback();
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();

  const totalBeats = parseInt(state.timeSignature.split('/')[0]);

  const handleBPMChange = (value: number) => {
    dispatch({ type: 'SET_BPM', payload: Math.max(30, Math.min(300, value)) });
  };

  const handleTogglePlay = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-24">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{
              fontFamily: "'Orbitron', monospace",
              letterSpacing: '0.05em',
              background: theme.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            节拍器
          </h1>
          <p style={{ color: theme.textSecondary }}>
            专业节奏控制
          </p>
        </div>

        <div
          className="p-8 mb-8 text-center"
          style={{
            backgroundColor: theme.surface,
            borderRadius: '16px',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div
            className="text-[72px] md:text-[88px] font-bold mb-2"
            style={{
              fontFamily: "'Orbitron', monospace",
              background: theme.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {state.bpm}
          </div>
          <div
            className="tracking-widest uppercase text-sm"
            style={{ color: theme.textSecondary }}
          >
            每分钟节拍数
          </div>
        </div>

        <div
          className="p-6 mb-8"
          style={{
            backgroundColor: theme.surface,
            borderRadius: '16px',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <span style={{ color: theme.textSecondary, fontSize: '12px', letterSpacing: '0.1em' }}>
              拍号
            </span>
            <span
              className="text-2xl font-bold"
              style={{
                fontFamily: "'Orbitron', monospace",
                color: theme.primary
              }}
            >
              {state.timeSignature}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 md:gap-4">
            {Array.from({ length: totalBeats }).map((_, i) => {
              const beatNum = i + 1;
              const isCurrent = beatNum === state.currentBeat;
              const isAccent = beatNum === 1;

              return (
                <div
                  key={beatNum}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-200"
                  style={{
                    backgroundColor: isCurrent
                      ? isAccent ? theme.primary : theme.secondary
                      : isAccent
                        ? `${theme.primary}33`
                        : `${theme.text}11`,
                    border: isCurrent ? 'none' : `1px solid ${theme.border}`,
                    boxShadow: isCurrent ? `0 0 15px ${theme.glow}` : 'none',
                    transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                    color: isCurrent ? '#ffffff' : theme.textSecondary
                  }}
                >
                  {beatNum}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="p-6 mb-8"
          style={{
            backgroundColor: theme.surface,
            borderRadius: '16px',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span style={{ color: theme.textSecondary, fontSize: '12px', letterSpacing: '0.1em' }}>
              速度
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleBPMChange(state.bpm - 1)}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{
                  backgroundColor: `${theme.text}11`,
                  border: `1px solid ${theme.border}`
                }}
              >
                <span style={{ color: theme.text, fontSize: '18px', fontWeight: 'bold' }}>−</span>
              </button>
              <button
                onClick={() => handleBPMChange(state.bpm + 1)}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{
                  backgroundColor: `${theme.text}11`,
                  border: `1px solid ${theme.border}`
                }}
              >
                <span style={{ color: theme.text, fontSize: '18px', fontWeight: 'bold' }}>+</span>
              </button>
            </div>
          </div>

          <input
            type="range"
            min="30"
            max="300"
            value={state.bpm}
            onChange={(e) => handleBPMChange(parseInt(e.target.value))}
            className="w-full"
            style={{
              height: '6px',
              borderRadius: '3px',
              backgroundColor: `${theme.text}11`,
              WebkitAppearance: 'none'
            }}
          />

          <div className="flex justify-between mt-2" style={{ color: theme.textSecondary, fontSize: '10px' }}>
            <span>30</span>
            <span>300</span>
          </div>
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={handleTogglePlay}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: state.isPlaying
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : theme.gradient,
              boxShadow: state.isPlaying ? 'none' : `0 0 30px ${theme.glow}`
            }}
          >
            <div className="w-0 h-0 border-t-[18px] border-t-transparent border-l-[32px] border-l-white border-b-[18px] border-b-transparent md:border-t-[20px] md:border-l-[36px] md:border-b-[20px] ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/settings"
            className="p-6 text-center transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              borderRadius: '16px',
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="text-3xl mb-2">⚙️</div>
            <span style={{ color: theme.text, fontWeight: '600' }}>参数设置</span>
          </Link>

          <Link
            to="/sound"
            className="p-6 text-center transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              borderRadius: '16px',
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="text-3xl mb-2">🔊</div>
            <span style={{ color: theme.text, fontWeight: '600' }}>声音设置</span>
          </Link>

          <Link
            to="/themes"
            className="p-6 text-center transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              borderRadius: '16px',
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="text-3xl mb-2">🎨</div>
            <span style={{ color: theme.text, fontWeight: '600' }}>主题选择</span>
          </Link>

          <Link
            to="/system"
            className="p-6 text-center transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              borderRadius: '16px',
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="text-3xl mb-2">🔧</div>
            <span style={{ color: theme.text, fontWeight: '600' }}>系统设置</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
