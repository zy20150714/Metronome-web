import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useTheme } from '../contexts/ThemeContext';
import { timeSignatures, subdivisions, formatTimeSignature } from '../utils/metronomeUtils';

const Settings: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();

  return (
    <div 
      className="min-h-screen p-4 sm:p-6"
      style={{ backgroundColor: theme.background }}
    >
      <div className="container mx-auto max-w-lg">
        <div className="mb-8">
          <Link
            to="/"
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
            参数设置
          </h1>
          <p style={{ color: theme.textSecondary }}>调整节拍器的参数配置</p>
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
          <h2 
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text }}
          >
            拍号
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {timeSignatures.map((ts) => (
              <button
                key={`${ts.beats}/${ts.noteValue}`}
                onClick={() => dispatch({ type: 'SET_TIME_SIGNATURE', payload: ts })}
                className={`p-3 rounded-lg font-semibold transition-all duration-300 ${
                  state.timeSignature.beats === ts.beats && state.timeSignature.noteValue === ts.noteValue
                    ? 'scale-105'
                    : 'hover:scale-102'
                }`}
                style={{ 
                  backgroundColor: state.timeSignature.beats === ts.beats && state.timeSignature.noteValue === ts.noteValue
                    ? theme.primary
                    : `${theme.primary}15`,
                  color: state.timeSignature.beats === ts.beats && state.timeSignature.noteValue === ts.noteValue
                    ? '#fff'
                    : theme.text,
                  borderRadius: theme.cardStyle === 'organic' ? '20px' : theme.cornerRadius,
                  boxShadow: state.timeSignature.beats === ts.beats && state.timeSignature.noteValue === ts.noteValue
                    ? `0 4px 16px ${theme.glow}`
                    : 'none'
                }}
              >
                {ts.beats}/{ts.noteValue}
              </button>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span style={{ color: theme.textSecondary }}>当前: {formatTimeSignature(state.timeSignature)}</span>
          </div>
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
          <h2 
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text }}
          >
            节拍细分
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {subdivisions.map((sub) => (
              <button
                key={sub.id}
                onClick={() => dispatch({ type: 'SET_SUBDIVISION', payload: sub.id })}
                className={`p-3 rounded-lg font-semibold transition-all duration-300 ${
                  state.subdivision === sub.id ? 'scale-105' : 'hover:scale-102'
                }`}
                style={{ 
                  backgroundColor: state.subdivision === sub.id
                    ? theme.primary
                    : `${theme.primary}15`,
                  color: state.subdivision === sub.id
                    ? '#fff'
                    : theme.text,
                  borderRadius: theme.cardStyle === 'organic' ? '20px' : theme.cornerRadius,
                  boxShadow: state.subdivision === sub.id
                    ? `0 4px 16px ${theme.glow}`
                    : 'none'
                }}
              >
                {sub.label}
              </button>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span style={{ color: theme.textSecondary }}>当前: {subdivisions.find(s => s.id === state.subdivision)?.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
