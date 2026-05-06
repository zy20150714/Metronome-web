import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useTheme } from '../contexts/ThemeContext';
import { subdivisionConfigs } from '../utils/metronomeUtils';

const Settings: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();
  const [numerator, denominator] = state.timeSignature.split('/').map(Number);

  const numeratorOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const denominatorOptions = [2, 4, 8, 16];

  const handleTimeSignatureChange = (newNumerator: number, newDenominator: number) => {
    dispatch({ 
      type: 'SET_TIME_SIGNATURE', 
      payload: `${newNumerator}/${newDenominator}` as any 
    });
  };

  const handleSubdivisionChange = (subdivision: any) => {
    dispatch({ type: 'SET_SUBDIVISION', payload: subdivision });
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 pb-24">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-lg font-semibold transition-all duration-300"
            style={{ 
              backgroundColor: theme.surface,
              color: theme.text,
              border: `1px solid ${theme.border}`
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </Link>
        </div>

        <div className="mb-10">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "'Orbitron', monospace", color: theme.text }}
          >
            参数设置
          </h1>
          <p style={{ color: theme.textSecondary }}>调整节拍器参数设置</p>
        </div>

        <div 
          className="p-6 mb-6"
          style={{ 
            backgroundColor: theme.surface,
            borderRadius: '16px',
            border: `1px solid ${theme.border}`
          }}
        >
          <h2 
            className="text-lg font-semibold mb-6"
            style={{ color: theme.primary }}
          >
            拍号设置
          </h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label 
                className="text-sm mb-3 block"
                style={{ color: theme.textSecondary }}
              >
                小节数
              </label>
              <div className="grid grid-cols-4 gap-2">
                {numeratorOptions.map(num => (
                  <button
                    key={num}
                    onClick={() => handleTimeSignatureChange(num, denominator)}
                    className="py-3 rounded-lg font-semibold transition-all duration-200"
                    style={{
                      backgroundColor: numerator === num ? theme.primary : `${theme.text}11`,
                      color: numerator === num ? '#ffffff' : theme.text,
                      border: numerator === num ? 'none' : `1px solid ${theme.border}`
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label 
                className="text-sm mb-3 block"
                style={{ color: theme.textSecondary }}
              >
                节拍单位
              </label>
              <div className="grid grid-cols-2 gap-2">
                {denominatorOptions.map(den => (
                  <button
                    key={den}
                    onClick={() => handleTimeSignatureChange(numerator, den)}
                    className="py-3 rounded-lg font-semibold transition-all duration-200"
                    style={{
                      backgroundColor: denominator === den ? theme.primary : `${theme.text}11`,
                      color: denominator === den ? '#ffffff' : theme.text,
                      border: denominator === den ? 'none' : `1px solid ${theme.border}`
                    }}
                  >
                    {den}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div 
            className="p-4 flex items-center justify-center gap-3"
            style={{ backgroundColor: `${theme.text}08`, borderRadius: '12px' }}
          >
            <span 
              className="text-5xl font-bold"
              style={{ fontFamily: "'Orbitron', monospace", color: theme.text }}
            >
              {numerator}
            </span>
            <div 
              className="w-12 h-0.5"
              style={{ backgroundColor: theme.primary }}
            />
            <span 
              className="text-5xl font-bold"
              style={{ fontFamily: "'Orbitron', monospace", color: theme.text }}
            >
              {denominator}
            </span>
          </div>
        </div>

        <div 
          className="p-6 mb-6"
          style={{ 
            backgroundColor: theme.surface,
            borderRadius: '16px',
            border: `1px solid ${theme.border}`
          }}
        >
          <h2 
            className="text-lg font-semibold mb-6"
            style={{ color: theme.primary }}
          >
            节拍细分
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {subdivisionConfigs.map(config => (
              <button
                key={config.value}
                onClick={() => handleSubdivisionChange(config.value)}
                className="p-4 rounded-xl transition-all duration-300 text-left"
                style={{
                  backgroundColor: state.subdivision === config.value ? `${theme.primary}22` : `${theme.text}08`,
                  border: state.subdivision === config.value ? `1px solid ${theme.primary}` : `1px solid ${theme.border}`
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className="font-semibold"
                    style={{ color: theme.text }}
                  >
                    {config.name}
                  </span>
                  <span className="text-xl">{config.symbol}</span>
                </div>
                <p 
                  className="text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  {config.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div 
          className="p-6"
          style={{ 
            backgroundColor: theme.surface,
            borderRadius: '16px',
            border: `1px solid ${theme.border}`
          }}
        >
          <h2 
            className="text-lg font-semibold mb-4"
            style={{ color: theme.textSecondary }}
          >
            当前设置
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${theme.text}08` }}
            >
              <div 
                className="text-xs mb-1"
                style={{ color: theme.textSecondary }}
              >
                拍号
              </div>
              <div 
                className="text-2xl font-bold"
                style={{ fontFamily: "'Orbitron', monospace", color: theme.text }}
              >
                {state.timeSignature}
              </div>
            </div>
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${theme.text}08` }}
            >
              <div 
                className="text-xs mb-1"
                style={{ color: theme.textSecondary }}
              >
                节拍细分
              </div>
              <div 
                className="text-2xl font-bold"
                style={{ fontFamily: "'Orbitron', monospace", color: theme.text }}
              >
                {subdivisionConfigs.find(c => c.value === state.subdivision)?.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
