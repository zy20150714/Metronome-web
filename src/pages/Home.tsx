import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useMetronomePlayback } from '../hooks/useMetronomePlayback';
import { useTheme } from '../contexts/ThemeContext';
import BeatDisplay from '../components/BeatDisplay/BeatDisplay';
import ControlPanel from '../components/ControlPanel/ControlPanel';

const Home: React.FC = () => {
  useMetronomePlayback();
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();

  const handleBPMChange = (value: number) => {
    dispatch({ type: 'SET_BPM', payload: Math.max(30, Math.min(300, value)) });
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-24" style={{ backgroundColor: theme.background }}>
      <div className="absolute inset-0 tech-bg grid-bg" />

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="text-center mb-8">
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

        <BeatDisplay />

        <ControlPanel />

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

        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/settings"
            className="p-6 text-center transition-all duration-300 hover-lift"
            style={{
              backgroundColor: theme.surface,
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}
          >
            <div className="text-3xl mb-2">⚙️</div>
            <span style={{ color: theme.text, fontWeight: '600' }}>参数设置</span>
          </Link>

          <Link
            to="/sound"
            className="p-6 text-center transition-all duration-300 hover-lift"
            style={{
              backgroundColor: theme.surface,
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}
          >
            <div className="text-3xl mb-2">🔊</div>
            <span style={{ color: theme.text, fontWeight: '600' }}>声音设置</span>
          </Link>

          <Link
            to="/themes"
            className="p-6 text-center transition-all duration-300 hover-lift"
            style={{
              backgroundColor: theme.surface,
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}
          >
            <div className="text-3xl mb-2">🎨</div>
            <span style={{ color: theme.text, fontWeight: '600' }}>主题选择</span>
          </Link>

          <Link
            to="/system"
            className="p-6 text-center transition-all duration-300 hover-lift"
            style={{
              backgroundColor: theme.surface,
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
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
