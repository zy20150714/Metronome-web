import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../../contexts/MetronomeContext';
import { useTheme } from '../../contexts/ThemeContext';
import { subdivisionConfigs, getSubdivisionConfig } from '../../utils/metronomeUtils';
import type { SubdivisionType } from '../../types';

const TimeSignatureSettings: React.FC = () => {
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
            拍号设置
          </h1>
          <p style={{ color: theme.textSecondary }}>设置小节数、节拍单位和节拍细分</p>
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
          <div className="mb-6">
            <div
              className="text-sm font-medium mb-4"
              style={{ color: theme.textSecondary }}
            >
              小节数
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {numeratorOptions.map((num) => (
                <button
                  key={`num-${num}`}
                  onClick={() => handleNumeratorChange(num)}
                  className={`min-w-[50px] py-3 px-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                    currentNumerator === num ? 'scale-105' : ''
                  }`}
                  style={{
                    backgroundColor: currentNumerator === num
                      ? theme.primary
                      : `${theme.primary}15`,
                    color: currentNumerator === num
                      ? '#fff'
                      : theme.text,
                    borderRadius: theme.cornerRadius,
                    boxShadow: currentNumerator === num
                      ? `0 4px 16px ${theme.glow}`
                      : 'none'
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div
              className="text-sm font-medium mb-4"
              style={{ color: theme.textSecondary }}
            >
              节拍单位
            </div>
            <div className="flex gap-3">
              {denominatorOptions.map((den) => (
                <button
                  key={`den-${den}`}
                  onClick={() => handleDenominatorChange(den)}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                    currentDenominator === den ? 'scale-105' : ''
                  }`}
                  style={{
                    backgroundColor: currentDenominator === den
                      ? theme.primary
                      : `${theme.primary}15`,
                    color: currentDenominator === den
                      ? '#fff'
                      : theme.text,
                    borderRadius: theme.cornerRadius,
                    boxShadow: currentDenominator === den
                      ? `0 4px 16px ${theme.glow}`
                      : 'none'
                  }}
                >
                  {den}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div
              className="text-sm font-medium mb-4"
              style={{ color: theme.textSecondary }}
            >
              节拍细分
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {subdivisionConfigs.map((config) => (
                <button
                  key={`sub-${config.value}`}
                  onClick={() => handleSubdivisionChange(config.value)}
                  title={config.description}
                  className={`min-w-[80px] py-4 px-3 rounded-lg transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 ${
                    state.subdivision === config.value ? 'scale-105' : ''
                  }`}
                  style={{
                    backgroundColor: state.subdivision === config.value
                      ? theme.primary
                      : `${theme.primary}15`,
                    color: state.subdivision === config.value
                      ? '#fff'
                      : theme.text,
                    borderRadius: theme.cornerRadius,
                    boxShadow: state.subdivision === config.value
                      ? `0 4px 16px ${theme.glow}`
                      : 'none'
                  }}
                >
                  <div className="text-3xl">{config.symbol}</div>
                  <div className="text-xs">{config.name}</div>
                </button>
              ))}
            </div>
            <div
              className="text-xs mt-3"
              style={{ color: theme.textSecondary }}
            >
              {currentSubdivisionConfig.description}
            </div>
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
            当前拍号预览
          </div>
          <div className="flex items-center justify-center gap-6">
            <div
              className="p-4 rounded-xl flex flex-col items-center justify-center"
              style={{
                backgroundColor: `${theme.primary}15`,
                border: `1px solid ${theme.primary}40`,
                borderRadius: theme.cornerRadius
              }}
            >
              <div className="text-3xl font-bold" style={{ color: theme.primary }}>
                {currentNumerator}
              </div>
              <div className="text-3xl font-bold" style={{ color: theme.primary }}>
                {currentDenominator}
              </div>
            </div>
            <div
              className="p-4 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${theme.primary}10`,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.cornerRadius
              }}
            >
              <div className="text-4xl" style={{ color: theme.primary }}>
                {currentSubdivisionConfig.symbol}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSignatureSettings;
