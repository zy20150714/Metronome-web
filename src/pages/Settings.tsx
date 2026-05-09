import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useTheme } from '../contexts/ThemeContext';
import { subdivisionConfigs, getSubdivisionConfig } from '../utils/metronomeUtils';
import type { SubdivisionType } from '../types';

const Settings: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();

  const numeratorOptions = Array.from({ length: 16 }, (_, i) => i + 1);
  const denominatorOptions = [2, 4, 8, 16];
  const [currentNumerator, currentDenominator] = state.timeSignature.split('/').map(Number);
  const currentSubdivisionConfig = getSubdivisionConfig(state.subdivision);

  const handleNumeratorChange = (numerator: number) => {
    dispatch({ type: 'SET_TIME_SIGNATURE', payload: `${numerator}/${currentDenominator}` as any });
  };

  const handleDenominatorChange = (denominator: number) => {
    dispatch({ type: 'SET_TIME_SIGNATURE', payload: `${currentNumerator}/${denominator}` as any });
  };

  const handleSubdivisionChange = (subdivision: SubdivisionType) => {
    dispatch({ type: 'SET_SUBDIVISION', payload: subdivision });
  };

  const handleBPMChange = (value: number) => {
    dispatch({ type: 'SET_BPM', payload: value });
  };

  const presetBPMS = [
    { label: 'Largo', value: 50 },
    { label: 'Adagio', value: 70 },
    { label: 'Andante', value: 90 },
    { label: 'Moderato', value: 110 },
    { label: 'Allegro', value: 140 },
    { label: 'Presto', value: 180 },
  ];

  return (
    <div 
      className="min-h-screen p-4 sm:p-6"
      style={{ backgroundColor: theme.background }}
    >
      <div className="container mx-auto max-w-lg">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-300"
            style={{ 
              backgroundColor: theme.surface,
              color: theme.text,
              border: `1px solid ${theme.border}`,
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
            className="text-2xl font-bold mb-1"
            style={{ color: theme.text }}
          >
            参数设置
          </h1>
          <p style={{ color: theme.textSecondary, fontSize: '14px' }}>调整节拍器的各项参数</p>
        </div>

        <div 
          className="mb-4 p-5 rounded-2xl"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold" style={{ color: theme.text }}>速度 (BPM)</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBPMChange(Math.max(20, state.bpm - 1))}
                className="w-10 h-10 rounded-lg font-bold flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: `${theme.primary}15`, color: theme.text }}
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
                className="w-16 py-2 px-3 rounded-lg text-center font-bold outline-none"
                style={{ backgroundColor: `${theme.primary}10`, color: theme.text, border: `1px solid ${theme.border}` }}
              />
              <button
                onClick={() => handleBPMChange(Math.min(300, state.bpm + 1))}
                className="w-10 h-10 rounded-lg font-bold flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: `${theme.primary}15`, color: theme.text }}
              >
                +
              </button>
            </div>
          </div>

          <input
            type="range"
            min="20"
            max="300"
            value={state.bpm}
            onChange={(e) => handleBPMChange(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer mb-4"
            style={{
              background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${((state.bpm - 20) / 280) * 100}%, ${theme.border} ${((state.bpm - 20) / 280) * 100}%, ${theme.border} 100%)`
            }}
          />

          <div className="grid grid-cols-6 gap-2">
            {presetBPMS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handleBPMChange(preset.value)}
                className={`py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  state.bpm === preset.value ? 'scale-105' : ''
                }`}
                style={{
                  backgroundColor: state.bpm === preset.value ? theme.primary : `${theme.primary}15`,
                  color: state.bpm === preset.value ? '#fff' : theme.textSecondary,
                  boxShadow: state.bpm === preset.value ? `0 2px 8px ${theme.glow}` : 'none'
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div 
          className="mb-4 p-5 rounded-2xl"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow
          }}
        >
          <h2 className="font-semibold mb-4" style={{ color: theme.text }}>拍号</h2>
          
          <div className="flex items-center gap-4 mb-5">
            <div 
              className="flex-1 p-4 rounded-xl text-center"
              style={{ backgroundColor: `${theme.primary}15`, border: `1px solid ${theme.primary}40` }}
            >
              <div className="text-2xl font-bold" style={{ color: theme.primary }}>{currentNumerator}</div>
              <div className="text-2xl font-bold" style={{ color: theme.primary }}>{currentDenominator}</div>
            </div>
            <div 
              className="flex-1 p-4 rounded-xl text-center flex items-center justify-center"
              style={{ backgroundColor: `${theme.primary}10`, border: `1px solid ${theme.border}` }}
            >
              <div className="text-3xl" style={{ color: theme.primary }}>{currentSubdivisionConfig.symbol}</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs mb-2" style={{ color: theme.textSecondary }}>小节数</div>
            <div className="flex gap-1 flex-wrap">
              {numeratorOptions.map((num) => (
                <button
                  key={`num-${num}`}
                  onClick={() => handleNumeratorChange(num)}
                  className={`min-w-[40px] py-2 px-1 rounded-lg font-medium text-sm transition-all duration-200 ${
                    currentNumerator === num ? 'scale-105' : ''
                  }`}
                  style={{
                    backgroundColor: currentNumerator === num ? theme.primary : `${theme.primary}15`,
                    color: currentNumerator === num ? '#fff' : theme.textSecondary
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs mb-2" style={{ color: theme.textSecondary }}>节拍单位</div>
            <div className="flex gap-2">
              {denominatorOptions.map((den) => (
                <button
                  key={`den-${den}`}
                  onClick={() => handleDenominatorChange(den)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    currentDenominator === den ? 'scale-105' : ''
                  }`}
                  style={{
                    backgroundColor: currentDenominator === den ? theme.primary : `${theme.primary}15`,
                    color: currentDenominator === den ? '#fff' : theme.text
                  }}
                >
                  {den}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs mb-2" style={{ color: theme.textSecondary }}>节拍细分</div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {subdivisionConfigs.map((config) => (
                <button
                  key={`sub-${config.value}`}
                  onClick={() => handleSubdivisionChange(config.value)}
                  className={`min-w-[60px] py-3 px-2 rounded-xl transition-all duration-200 flex flex-col items-center ${
                    state.subdivision === config.value ? 'scale-105' : ''
                  }`}
                  style={{
                    backgroundColor: state.subdivision === config.value ? theme.primary : `${theme.primary}15`,
                    color: state.subdivision === config.value ? '#fff' : theme.text
                  }}
                >
                  <div className="text-xl">{config.symbol}</div>
                  <div className="text-[10px] mt-1 opacity-80">{config.name}</div>
                </button>
              ))}
            </div>
            <div className="text-xs mt-2" style={{ color: theme.textSecondary }}>
              {currentSubdivisionConfig.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
